import React, { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer 
      className="text-light pt-5 pb-3" 
      style={{ 
        backgroundColor: "#0f172a", 
        borderTop: "1px solid #1e293b",
        fontFamily: "'Outfit', 'Inter', sans-serif" 
      }}
    >
      <div className="container">
        {/* Main Footer Content */}
        <div className="row g-4 mb-5">
          
          {/* Company Info */}
          <div className="col-12 col-lg-4 col-md-6">
            <h3 className="text-warning"style={{fontFamily:"bold monospace"}}>Zonda</h3>
            <p className="small pe-lg-4" style={{ lineHeight: "1.6", color: "#94a3b8" }}>
              Zonda is your premium destination for next-generation electronics, business computing, cinema audio, smartwear, and everyday tech essentials. Discover curated quality at competitive prices.
            </p>
            {/* Social Links */}
            <div className="d-flex gap-2 mt-4">
              {["facebook", "instagram", "twitter-x", "linkedin", "youtube"].map((social) => (
                <a 
                  key={social}
                  href={`https://${social}.com`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="d-flex align-items-center justify-content-center rounded-circle border transition-all text-light"
                  style={{ 
                    width: "36px", 
                    height: "36px", 
                    borderColor: "#334155", 
                    backgroundColor: "transparent",
                    transition: "all 0.25s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0d6efd";
                    e.currentTarget.style.borderColor = "#0d6efd";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#334155";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <i className={`bi bi-${social}`} style={{ fontSize: "14px" }}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-6 col-lg-2 col-md-3">
            <h6 className="fw-bold text-white mb-3 text-uppercase" style={{ letterSpacing: "1px", fontSize: "13px" }}>Shop</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: "13px" }}>
              <li>
                <Link to="/products" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  Weekly Deals
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  Trending Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-6 col-lg-2 col-md-3">
            <h6 className="fw-bold text-white mb-3 text-uppercase" style={{ letterSpacing: "1px", fontSize: "13px" }}>Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: "13px" }}>
              <li>
                <Link to="/contact" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase" style={{ letterSpacing: "1px", fontSize: "13px" }}>Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: "13px" }}>
              <li>
                <Link to="/Aboutpage" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none transition-all" style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#0d6efd"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-12 col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase" style={{ letterSpacing: "1px", fontSize: "13px" }}>Newsletter</h6>
            <p className="small mb-3" style={{ fontSize: "12px", color: "#94a3b8" }}>
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleSubscribe} className="d-flex flex-column gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control form-control-sm border-0 text-white shadow-none"
                style={{ 
                  backgroundColor: "#1e293b", 
                  borderRadius: "8px", 
                  fontSize: "12px", 
                  padding: "9px 12px"
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary btn-sm fw-semibold w-100 py-2"
                style={{ borderRadius: "8px", fontSize: "12px" }}
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <span className="text-success d-block mt-2 small fw-semibold" style={{ fontSize: "11px" }}>
                <i className="bi bi-check2-circle me-1"></i> Subscribed successfully!
              </span>
            )}
          </div>

        </div>

        {/* Divider */}
        <hr className="mb-4" style={{ borderColor: "#1e293b" }} />

        {/* Bottom Footer Area */}
        <div className="row align-items-center g-3" style={{ fontSize: "12px" }}>
          
          {/* Copyrights & Legal Links */}
          <div className="col-12 col-md-8 text-center text-md-start">
            <span className="text-muted">
              © {new Date().getFullYear()} Zonda Store. All rights reserved.
            </span>
            <div className="d-inline-flex gap-2.5 ms-md-3 mt-2 mt-md-0 d-block d-md-inline-block">
              <span className="text-muted d-none d-md-inline">|</span>
              <Link to="/contact" className="text-decoration-none text-muted" style={{ color: "#64748b" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#94a3b8"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
              >
                Privacy Policy
              </Link>
              <span className="text-muted">•</span>
              <Link to="/contact" className="text-decoration-none text-muted" style={{ color: "#64748b" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#94a3b8"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
              >
                Terms of Service
              </Link>
              <span className="text-muted">•</span>
              <Link to="/contact" className="text-decoration-none text-muted" style={{ color: "#64748b" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#94a3b8"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
              >
                Return Policy
              </Link>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <div className="d-inline-flex align-items-center gap-2 text-muted" style={{ fontSize: "18px" }}>
              <i className="bi bi-credit-card-2-front" title="Credit Cards" style={{ color: "#94a3b8" }}></i>
              <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px" }}>VISA / MC / AMEX / PAYPAL</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;