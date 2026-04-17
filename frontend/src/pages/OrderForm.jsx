import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function OrderForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    dob: "",
    gender: "",
    customerType: "consumer",
    products: [{ name: "", price: "", quantity: "" }]
  });

  // product ko add karta hain 
  const addProduct = () => {
    setForm({
      ...form,
      products: [...form.products, { name: "", price: "", quantity: "" }]
    });
  };

  // product ko remove karta hain 
  const removeProduct = (index) => {
    const updated = form.products.filter((_, i) => i !== index);
    setForm({ ...form, products: updated });
  };

  // product change handle karta hain 
  const handleProductChange = (index, field, value) => {
    const updated = [...form.products];
    updated[index][field] = value;
    setForm({ ...form, products: updated });
  };

  // Total Calculate karta hain price ka 
  const totalAmount = form.products.reduce((acc, p) => {
    return acc + (Number(p.price) || 0) * (Number(p.quantity) || 0);
  }, 0);

  // Submit button ko handle karta hain 
  const handleSubmit = async () => {
    try {
      await API.post("/orders/create", {
        customerName: form.customerName,
        mobile: form.mobile,
        dob: form.dob,
        gender: form.gender,
        products: form.products,
        customerType: form.customerType
      });

      alert("✅ Order Created");
      navigate("/orders");

    } catch (err) {
      console.log(err);
      alert("❌ Error creating order");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 min-h-screen py-8 px-4">
      
      {/*  BACK karne ke liyi button hain */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 bg-gray-500/80 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium shadow-md dark:text-gray-100"
      >
        ⬅ Back
      </button>

      {/*  CARD  pe pop up ki open hota hain form */}
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white p-8">
          <h2 className="text-3xl font-bold text-center flex items-center justify-center">
            <span className="mr-3 text-3xl">🧾</span> Create New Order
          </h2>
        </div>

        <div className="p-8">
          {/*  CUSTOMER DETAILS ke liyi hain  */}
          <div className="mb-10">
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-3 text-2xl">👤</span> Customer Details
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                placeholder="Customer Name"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all duration-200"
              />

              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all duration-200"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all duration-200"
              />

              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all duration-200"
              />
            </div>

            <select
              value={form.customerType}
              onChange={(e) => setForm({ ...form, customerType: e.target.value })}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all duration-200 mt-6"
            >
              <option value="consumer">Consumer</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <hr className="border-gray-200 dark:border-gray-700 mb-10" />

          {/*  PRODUCTS details ke liyi hain */}
          <div className="mb-10">
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-3 text-2xl">🛒</span> Products
            </h4>

            {form.products.map((p, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-2xl p-6 mb-6 bg-gray-50/50 dark:bg-gray-700/30 backdrop-blur-sm shadow-sm">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <input
                    placeholder="Product Name"
                    value={p.name}
                    onChange={(e) => handleProductChange(index, "name", e.target.value)}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all duration-200"
                  />

                  <input
                    placeholder="Price"
                    type="number"
                    value={p.price}
                    onChange={(e) => handleProductChange(index, "price", e.target.value)}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all duration-200"
                  />

                  <input
                    placeholder="Quantity"
                    type="number"
                    value={p.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all duration-200"
                  />
                </div>

                {form.products.length > 1 && (
                  <button
                    onClick={() => removeProduct(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-red-400/30"
                  >
                    Remove Product
                  </button>
                )}
              </div>
            ))}

            {/* product ko add karne ke liyi hain */}
            <button
              onClick={addProduct}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center border border-indigo-400/30"
            >
              <span className="mr-3 text-xl">➕</span> Add Product
            </button>
          </div>

          {/* TOTAL calculate karta hain  */}
          <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 p-6 rounded-2xl mb-8 shadow-lg border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
            <h3 className="text-3xl font-black text-gray-900 dark:text-emerald-100 text-center flex items-center justify-center">
              <span className="mr-3">💰</span>
              Total Amount: ₹{totalAmount.toLocaleString()}
            </h3>
          </div>

          {/* SUBMIT karne ke liyi button  */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 text-white py-5 rounded-2xl text-xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center border border-green-400/30"
          >
            <span className="mr-3 text-2xl">✅</span> Create Order
          </button>
        </div>
      </div>
    </div>
  );
}

