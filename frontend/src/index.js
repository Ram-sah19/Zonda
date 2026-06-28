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
import Supportpage from './landingpage/support/Supportpage';
import Singup from "./landingpage/singup/Singup";
import Login from "./landingpage/singup/Login";
import Profilepage from "./landingpage/singup/Profilepage";
import { AuthProvider } from './context/AuthContext';
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Aboutpage" element={<Aboutpage />} />
        <Route path="/deals" element={<Dealpage />} />
        <Route path="/products" element={<Productpage />} />
        <Route path="/contact" element={<Supportpage />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profilepage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  </BrowserRouter>
);
