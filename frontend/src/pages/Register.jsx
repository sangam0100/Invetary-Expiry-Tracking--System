import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [captcha, setCaptcha] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!captcha) return alert("Please verify captcha");

    try {
      await API.post("/auth/register", {
        ...form,
        captchaToken: captcha
      });

      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Register Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br dark:from-gray-900 dark:to-slate-900 from-emerald-50 to-green-100 p-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-600">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-slate-800 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Join us today</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Full Name
            </label>
            <input
              placeholder="Enter your full name"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
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
              placeholder="Create a password"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-4 w-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex justify-center">
            <ReCAPTCHA
              sitekey="6LePnY4sAAAAAPoeQLvm0pdDnVzzSruPqkmA9NzV"
              onChange={(val) => setCaptcha(val)}
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={!form.name || !form.email || !form.password || !captcha}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white w-full p-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform disabled:cursor-not-allowed disabled:transform-none"
          >
            Create Account
          </button>
        </div>

        {/* Login Link provide karta hain  */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer font-semibold transition-colors" onClick={() => navigate("/")}>
            Already have an account? <span className="underline">Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

