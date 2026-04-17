import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import ExpiryProducts from "./pages/ExpiryProducts";
import Order from "./pages/Order";
import OrderForm from "./pages/OrderForm";
import Invoice from "./pages/Invoice";
import AdminUsers from "./pages/AdminUsers";



function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard/*" element={<Dashboard />} />

            <Route path="/products" element={<Products />} />
            <Route path="/expiry" element={<ExpiryProducts />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/order-form" element={<OrderForm />} />
            <Route path="/create-order" element={<OrderForm />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/admin-users" element={<AdminUsers />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
