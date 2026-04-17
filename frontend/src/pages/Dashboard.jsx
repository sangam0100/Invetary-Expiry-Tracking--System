import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";

//  Charts ke liyi hain 
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({
    totalProducts: 0,
    expiringProducts: 0,
    expiredProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    todaySales: 0,
    monthlySales: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard/stats");
        setData(res.data);
      } catch (err) {
        console.log("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  //  Pie Chart Colors
  const COLORS = ["#3B82F6", "#EF4444", "#F97316", "#22C55E"];

  const chartData = [
    { name: "Products", value: data.totalProducts },
    { name: "Expired", value: data.expiredProducts },
    { name: "Expiring", value: data.expiringProducts },
    { name: "Orders", value: data.totalOrders }
  ];

  // 📊 Monthly Sales Data (Bar Chart)
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const barData = months.map((m, i) => ({
    name: m,
    sales: data.monthlySales[i] || 0
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8 max-w-7xl mx-auto">
          {/* Header section  */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 to-slate-800 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
                  Dashboard
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Monitor your products, orders, and sales performance in real-time
                </p>
              </div>
            </div>
          </div>

          {/*  Stats Cards ke liyi hain  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            <Card title="Total Products" value={data.totalProducts} color="bg-gradient-to-br from-blue-500 to-blue-600" icon="📦" />
            <Card title="Expired Products" value={data.expiredProducts} color="bg-gradient-to-br from-red-500 to-red-600" icon="⚠️" />
            <Card title="Expiring Soon" value={data.expiringProducts} color="bg-gradient-to-br from-orange-500 to-orange-600" icon="⏰" />
            <Card title="Total Orders" value={data.totalOrders} color="bg-gradient-to-br from-emerald-500 to-emerald-600" icon="📋" />
            <Card title="Total Sales" value={`₹${data.totalSales}`} color="bg-gradient-to-br from-purple-500 to-purple-600" icon="💰" />
            <Card title="Today's Sales" value={`₹${data.todaySales}`} color="bg-gradient-to-br from-pink-500 to-rose-600" icon="📈" />
          </div>

          {/* Charts ke liyi  */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
            {/* 📊 Pie Chart ke liyi  */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-xl text-white font-bold">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Overview</h2>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 📈 Bar Chart - Monthly Sales ke liyi hain  */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-xl text-white font-bold">📈</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Sales Trend</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">₹{data.totalSales.toLocaleString()} total revenue</p>
                </div>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid vertical={false} stroke="#f8fafc" strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={14} />
                    <YAxis stroke="#64748b" fontSize={14} />
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                      labelStyle={{ color: '#334155', fontWeight: '600' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="sales" 
                      fill="#3B82F6" 
                      radius={[6, 6, 0, 0]}
                      barSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

