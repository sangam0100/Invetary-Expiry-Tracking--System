import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [captcha, setCaptcha] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br dark:from-gray-900 dark:to-slate-900 from-blue-50 to-indigo-100 p-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-600">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-slate-800 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!form.email || !form.password}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white w-full p-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform disabled:cursor-not-allowed disabled:transform-none"
          >
            Sign In
          </button>
        </div>

        {/* Navigation Links to perform this site */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center space-y-3">
          <p
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer font-semibold transition-colors"
            onClick={() => navigate("/register")}
          >
            Don't have an account? <span className="underline">Create one</span>
          </p>
          <p
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer font-semibold transition-colors"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot your password?
          </p>
        </div>
      </div>
    </div>
  );
}

