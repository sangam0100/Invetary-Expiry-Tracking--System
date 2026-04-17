import React, { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const url = filter
        ? `/orders?type=${filter}`
        : "/orders";

      const res = await API.get(url);
      setOrders(res.data);
    } catch (err) {
      console.log("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updatePayment = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Paid" : "Pending";

    await API.put(`/orders/payment/${id}`, {
      status: newStatus
    });

    fetchOrders();
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Delete this order?")) {
      await API.delete(`/orders/${id}`);
      fetchOrders();
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-8">
          {/* Header section hain  */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📦 Orders</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage all your orders, payments, and invoices</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/order-form")}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg"
              >
                ➕ New Order
              </button>
            </div>
          </div>

          {/* Filter ka kam karta hain jaise kon order kiya hain staff ya consumer */}
          <div className="mb-8">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Orders</option>
              <option value="consumer">Consumer</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Orders Table design kiya hu  */}
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Orders Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first order to get started</p>
              <button
                onClick={() => navigate("/order-form")}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg"
              >
                ➕ Create Order
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Mobile</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">DOB</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{order.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {order.gender || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {order.mobile || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          {order.dob ? new Date(order.dob).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {order.products.map((p, i) => (
                              <div key={i} className="text-sm text-gray-900 dark:text-gray-300">
                                {p.name} × {p.quantity}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">₹{order.totalAmount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => updatePayment(order._id, order.paymentStatus)}
                            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                              order.paymentStatus === "Paid" 
                                ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25" 
                                : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25"
                            }`}
                          >
                            {order.paymentStatus}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/invoice/${order._id}`)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200"
                          >
                            View Invoice
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-red-500/25 transition-all duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

