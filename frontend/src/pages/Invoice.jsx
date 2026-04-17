import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/invoice-data/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handlePrint = () => window.print();

  const handleGenerate = async () => {
    try {
      const response = await API.get(`/orders/invoice/${id}`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    }
  };

  if (!order) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading Invoice...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button ke liyi  */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          ← Back to Orders
        </button>

        {/* Invoice Card  ye bill ke liyi hian */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700 p-10">
          {/* Header section ke liyi  */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10 pb-8 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl text-white font-bold">🧾</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-slate-800 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  INVOICE BILL
                </h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Invoice ID</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{order._id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Customer Details show karne ke liyi hain  */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-600 pb-4">Customer Details</h3>
              <div className="space-y-3 text-sm">
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">👤 Name:</span> {order.customerName}</p>
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">⚤ Gender:</span> {order.gender || "N/A"}</p>
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">📱 Mobile:</span> {order.mobile || "N/A"}</p>
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">🎂 DOB:</span> {order.dob ? new Date(order.dob).toLocaleDateString() : "N/A"}</p>
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">📅 Order Date:</span> {new Date(order.date).toLocaleString()}</p>
              </div>
            </div>

            {/* Products Table banane ke liyi hain  */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-600 pb-4">Products Ordered</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {order.products.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{p.name}</td>
                        <td className="px-4 py-4 text-center text-sm text-gray-700 dark:text-gray-300">{p.quantity}</td>
                        <td className="px-4 py-4 text-right text-sm text-gray-700 dark:text-gray-300">₹{p.price.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right font-bold text-lg text-gray-900 dark:text-white">
                          ₹{(p.price * p.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Total  balance ke liyi hian */}
          <div className="text-right mb-12">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-2xl font-bold text-white shadow-2xl shadow-emerald-500/25">
              <span className="mr-3">💰</span>
              TOTAL: ₹{order.totalAmount.toLocaleString()}
            </div>
          </div>

          {/* Buttons kaam kar rha hain ki nhi  */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePrint}
              className="flex-1 max-w-md px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
            >
              <span className="mr-2">🖨️</span>
              Print Invoice
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 max-w-md px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
            >
              <span className="mr-2">📄</span>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

