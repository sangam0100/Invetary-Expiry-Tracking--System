import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function ExpiryProducts() {
  const [expired, setExpired] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/products/expiring");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiredList = [];
      const expiringList = [];

      res.data.forEach((p) => {
        if (!p.expiryDate) return;

        const expiry = new Date(p.expiryDate);
        expiry.setHours(0, 0, 0, 0);

        const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);

        if (diffDays < 0) {
          expiredList.push(p);
        } else if (diffDays <= 7) {
          expiringList.push(p);
        }
      });

      setExpired(expiredList);
      setExpiring(expiringList);
    } catch (err) {
      console.log("❌ Error fetching data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-gray-600 dark:text-gray-300">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          {/* EXPIRED PRODUCTS ke liyi hain yeh */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-6 flex items-center">
              ❌ Expired Products
            </h2>

            {expired.length === 0 ? (
              <div className="bg-green-50 dark:bg-gray-800 dark:border-gray-700 border-2 border-green-200 p-8 rounded-3xl text-center">
                <div className="text-4xl mb-4">✅</div>
                <p className="text-lg text-green-800 dark:text-green-300 font-semibold">No expired products found!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {expired.map((p) => (
                  <div
                    key={p._id}
                    className="bg-red-50 dark:bg-red-900/30 dark:border-red-800/50 border-2 border-red-200 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-1">{p.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <p className="text-gray-700 dark:text-gray-300">
                            📦 Quantity: <span className="font-semibold">{p.quantity}</span>
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            📅 Expiry: <span className="font-semibold text-red-600 dark:text-red-400">
                              {new Date(p.expiryDate).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            ⏰ Days Overdue: <span className="font-semibold text-red-600 dark:text-red-400">
                              {Math.ceil((new Date() - new Date(p.expiryDate)) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7 din baad jo product EXPIRING hone wala hain */}
          <div>
            <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-6 flex items-center">
              ⚠️ Expiring in 7 Days
            </h2>

            {expiring.length === 0 ? (
              <div className="bg-amber-50 dark:bg-amber-900/30 dark:border-amber-800/50 border-2 border-amber-200 p-8 rounded-3xl text-center">
                <div className="text-4xl mb-4">⏰</div>
                <p className="text-lg text-amber-800 dark:text-amber-200 font-semibold">No products expiring soon</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {expiring.map((p) => (
                  <div
                    key={p._id}
                    className="bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-800/50 border-2 border-yellow-200 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-1">{p.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <p className="text-gray-700 dark:text-gray-300">
                            📦 Quantity: <span className="font-semibold">{p.quantity}</span>
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            📅 Expiry: <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                              {new Date(p.expiryDate).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            ⏰ Days Remaining: <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                              {Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
