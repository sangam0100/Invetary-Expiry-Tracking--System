const cron = require("node-cron");
const Product = require("../models/Product");
const sendSMS = require("./sendSMS");
const fs = require("fs");
const path = require("path");

const LOGS_DIR = path.join(__dirname, '../logs');
const ALERT_LOG_PATH = path.join(LOGS_DIR, 'alerts.log');
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const ensureLogsDirectory = () => {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
};

const readLastAlertTimestamp = () => {
  if (!fs.existsSync(ALERT_LOG_PATH)) {
    return null;
  }

  try {
    const data = fs.readFileSync(ALERT_LOG_PATH, 'utf8').trim();
    if (!data) return null;
    const timestamp = new Date(data);
    return Number.isNaN(timestamp.getTime()) ? null : timestamp;
  } catch (err) {
    console.log("❌ Error reading alert log:", err.message);
    return null;
  }
};

const writeLastAlertTimestamp = (timestamp) => {
  try {
    ensureLogsDirectory();
    fs.writeFileSync(ALERT_LOG_PATH, timestamp.toISOString());
  } catch (err) {
    console.log("❌ Error writing alert log:", err.message);
  }
};

const buildMessage = (expiredList, expiringList) => {
  let message = "";

  if (expiredList.length > 0) {
    message += "❌ Expired Products:\n";
    expiredList.forEach((p) => {
      message += `- ${p.name} (${p.quantity || 0})\n`;
    });
  }

  if (expiringList.length > 0) {
    if (message) message += "\n";
    message += "⚠️ Expiring in 7 days:\n";
    expiringList.forEach((p) => {
      message += `- ${p.name} (${p.quantity || 0})\n`;
    });
  }

  return message.trim();
};

const getProductAlerts = async () => {
  const products = await Product.find();

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const expiredList = [];
  const expiringList = [];

  products.forEach((p) => {
    if (!p.expiryDate) return;

    const expiry = new Date(p.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffDays = (expiry - currentDate) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      expiredList.push(p);
    } else if (diffDays <= 7) {
      expiringList.push(p);
    }
  });

  return { expiredList, expiringList };
};

const performAlertCheck = async ({ force = false, context = 'startup' } = {}) => {
  console.log(`\n📱 [${context}] Checking expiry products...`);

  const lastSentAt = readLastAlertTimestamp();
  const now = new Date();

  if (!force && lastSentAt) {
    const sinceLastSend = now - lastSentAt;
    if (sinceLastSend < ONE_DAY_MS) {
      console.log(`✅ Alert already sent ${Math.floor(sinceLastSend / (60 * 1000))} minutes ago; skipping until 24h passed.`);
      return { skipped: true, reason: 'sent_recently' };
    }
  }

  const { expiredList, expiringList } = await getProductAlerts();

  console.log("📊 Expired:", expiredList.length);
  console.log("📊 Expiring:", expiringList.length);

  const message = buildMessage(expiredList, expiringList);

  if (!message) {
    console.log("✅ No alerts to send");
    return { skipped: true, reason: 'no_alerts' };
  }

  console.log("📩 Sending SMS...");
  console.log("📨 Message content:\n", message);
  await sendSMS(message);
  writeLastAlertTimestamp(now);
  console.log("✅ Alert sent and timestamp saved");

  return { skipped: false, expiredCount: expiredList.length, expiringCount: expiringList.length };
};

const scheduleDailyAlerts = () => {
  cron.schedule("0 9 * * *", async () => {
    try {
      await performAlertCheck({ context: 'cron' });
    } catch (err) {
      console.log("❌ Cron Error:", err.message);
    }
  });
};

const testSMSAlerts = async () => {
  console.log("\n🧪 Testing SMS Alerts...");
  await performAlertCheck({ force: true, context: 'test' });
};

module.exports = {
  scheduleDailyAlerts,
  checkAndSendAlerts: performAlertCheck,
  testSMSAlerts,
};
