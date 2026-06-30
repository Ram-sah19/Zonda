import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Homepage from "./landingpage/home/Homepage";
import Navbar from './landingpage/Navbar';
import Footer from './landingpage/Footer';
import Aboutpage from './landingpage/about/Aboutpage';
import Dealpage from './landingpage/deal/Dealpage';
import Productpage from './landingpage/product/Productpage';
import ProductDetails from './landingpage/product/ProductDetails';
import Supportpage from './landingpage/support/Supportpage';
import Singup from "./landingpage/singup/Singup";
import Login from "./landingpage/singup/Login";
import Profilepage from "./landingpage/singup/Profilepage";
import Cartpage from "./landingpage/singup/Cartpage";
import Orderpage from "./landingpage/order/Orderpage";
import Sellerpage from "./landingpage/seller/Sellerpage";
import SellerRegister from "./landingpage/seller/SellerRegister";
import BrandStore from "./landingpage/product/BrandStore";
import AdminRegister from "./landingpage/admin/AdminRegister";
import AdminDashboard from "./landingpage/admin/AdminDashboard";
import DeliveryRegister from "./landingpage/delivery/DeliveryRegister";
import DeliveryDashboard from "./landingpage/delivery/DeliveryDashboard";
import CustomerTrackDelivery from "./landingpage/delivery/CustomerTrackDelivery";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Aboutpage" element={<Aboutpage />} />
          <Route path="/deals" element={<Dealpage />} />
          <Route path="/products" element={<Productpage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<Supportpage />} />
          <Route path="/signup" element={<Singup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/cart" element={<Cartpage />} />
          <Route path="/orders" element={<Orderpage />} />
          <Route path="/seller" element={<Sellerpage />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/brand/:brandName" element={<BrandStore />} />
          <Route path="/admin/signup" element={<AdminRegister />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/delivery/register" element={<DeliveryRegister />} />
          <Route path="/signup-delivery" element={<DeliveryRegister />} />
          <Route path="/delivery/signup" element={<DeliveryRegister />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/orders/track/:orderId" element={<CustomerTrackDelivery />} />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
