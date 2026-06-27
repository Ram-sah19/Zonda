import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Deals", path: "/deals" },
    { name: "About Us", path: "/Aboutpage" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-light sticky-top px-4 shadow-sm" 
      style={{ 
        zIndex: 1020,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        transition: "all 0.3s ease"
      }}
    >
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img
            src="media/logo.png"
            alt="Logo"
            style={{ 
              height: "45px", 
              transition: "transform 0.3s ease" 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Navigation Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li className="nav-item" key={link.name}>
                  <Link 
                    className={`nav-link px-3 py-2 fw-semibold rounded-3 transition-all`} 
                    to={link.path}
                    style={{
                      color: isActive ? "#0d6efd" : "#475569",
                      backgroundColor: isActive ? "rgba(13, 110, 253, 0.08)" : "transparent",
                      fontSize: "14px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#0d6efd";
                        e.currentTarget.style.backgroundColor = "rgba(13, 110, 253, 0.04)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#475569";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Search, Cart & Profile Actions */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* Search Box */}
            <div 
              className="d-flex align-items-center bg-light rounded-pill px-3 py-1.5 border"
              style={{ 
                width: "200px", 
                borderColor: isSearchFocused ? "#0d6efd" : "#e2e8f0", 
                boxShadow: isSearchFocused ? "0 0 0 3px rgba(13, 110, 253, 0.15)" : "none",
                transition: "all 0.3s ease" 
              }}
            >
              <i className="bi bi-search text-muted me-2" style={{ fontSize: "14px" }}></i>
              <input 
                type="text" 
                placeholder="Search products..." 
                className="border-0 bg-transparent"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                style={{ 
                  fontSize: "13px", 
                  outline: "none", 
                  width: "100%",
                  color: "#1e293b" 
                }} 
              />
            </div>

            {/* Cart Icon with Badge */}
            <Link 
              to="/cart" 
              className="btn btn-light rounded-circle position-relative p-2 d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0d6efd"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
            >
              <i className="bi bi-bag text-dark" style={{ fontSize: "16px" }}></i>
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                style={{ fontSize: "10px", padding: "4px 6px" }}
              >
                3
              </span>
            </Link>

            {/* User Profile */}
            <div className="dropdown">
              <button 
                className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                type="button"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0d6efd"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <i className="bi bi-person text-dark" style={{ fontSize: "17px" }}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;