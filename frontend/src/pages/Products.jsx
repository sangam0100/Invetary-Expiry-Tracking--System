import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    expiryDate: ""
  });

  const [editId, setEditId] = useState(null); 

  //  FETCH
  const fetchData = () => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  ADD / UPDATE
  const handleSubmit = async () => {
    if (!form.name || !form.quantity || !form.expiryDate) {
      return alert("All fields required");
    }

    if (editId) {
      //  UPDATE
      await API.put(`/products/${editId}`, form);
      alert("Product Updated ✅");
    } else {
      //  ADD
      await API.post("/products", form);
      alert("Product Added ✅");
    }

    //  reset
    setForm({ name: "", quantity: "", expiryDate: "" });
    setEditId(null);
    setShowModal(false);
    fetchData();
  };

  //  DELETE
  const deleteProduct = async (id) => {
    await API.delete(`/products/${id}`);
    fetchData();
  };

  //  EDIT CLICK karta hain 
  const editProduct = (p) => {
    setForm({
      name: p.name,
      quantity: p.quantity,
      expiryDate: p.expiryDate?.substring(0, 10)
    });
    setEditId(p._id);
    setShowModal(true);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <p className="text-sm text-gray-500 mt-1">
                Use the popup to add or update inventory items with ease.
              </p>
            </div>
            <button
              onClick={() => {
                setForm({ name: "", quantity: "", expiryDate: "" });
                setEditId(null);
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Add New Product
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-xl rounded-[30px] bg-white dark:bg-gray-800 p-8 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {editId ? "Edit Product" : "Add Product"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                      Add or update product information from the popup form.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
                  <input
                    placeholder="Product Name"
                    value={form.name}
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    placeholder="Quantity"
                    value={form.quantity}
                    type="number"
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                  <input
                    type="date"
                    value={form.expiryDate}
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 transition-colors"
                  >
                    {editId ? "Save Changes" : "Add Product"}
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditId(null);
                      setForm({ name: "", quantity: "", expiryDate: "" });
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-2xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Product List</h2>
          </div>

          <div className="grid gap-4">
            {products.map((p) => (
                <div
                  key={p._id}
                  className={`p-5 rounded-3xl shadow-sm border dark:bg-gray-800 dark:border-gray-700 ${
                    new Date(p.expiryDate) < new Date()
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                  }`}
                >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{p.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {p.quantity}</p>
                    <p className="text-sm text-gray-600">Expiry: {new Date(p.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => editProduct(p)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}