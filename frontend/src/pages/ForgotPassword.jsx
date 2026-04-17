import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });

  const navigate = useNavigate();

  // SEND OTP ke liyi hain 
  const sendOtp = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/send-otp", {
        email: data.email
      });

      alert("Your OTP: " + res.data.otp); 
      setStep(2);

    } catch (err) {
      alert(err.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP + RESET PASSWORD ke liyi hain yeh 
  const verifyOtp = async () => {
    try {
      setLoading(true);

      await API.post("/auth/verify-otp", {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword
      });

      alert("Password Updated Successfully ✅");

      //  reset form karne ke liyi 
      setData({
        email: "",
        otp: "",
        newPassword: ""
      });

      // redirect to login
      navigate("/");

    } catch (err) {
      alert(err.response?.data || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br dark:from-gray-900 dark:to-slate-900 from-orange-50 to-red-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-600">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
            Reset Password
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {step === 1 ? "Enter your email to receive OTP" : "Enter OTP and new password"}
          </p>
        </div>

        {/* EMAIL */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading || !data.email}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white w-full p-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* OTP & NEW PASSWORD ke liyi yeh hain*/}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Verification OTP
              </label>
              <input
                placeholder="Enter 6-digit OTP"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-center text-xl font-bold tracking-widest"
                maxLength="6"
                value={data.otp}
                onChange={(e) => setData({ ...data, otp: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                value={data.newPassword}
                onChange={(e) => setData({ ...data, newPassword: e.target.value })}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                Back
              </button>
              <button
                onClick={verifyOtp}
                disabled={loading || !data.otp || !data.newPassword}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>
            </div>
          </div>
        )}

        {/* Back to Login button ke liyi hain  */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer font-semibold transition-colors inline-block"
            onClick={() => navigate("/")}
          >
            ← Back to Login
          </p>
        </div>
      </div>
    </div>
  );
}

