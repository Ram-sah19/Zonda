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
import BrandStore from "./landingpage/product/BrandStore";
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
          <Route path="/brand/:brandName" element={<BrandStore />} />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
