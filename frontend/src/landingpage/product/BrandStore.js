import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const BRAND_THEMES = {
  samsung: {
    logo: "⚡",
    tag: "Galaxy Fest Store",
    desc: "Pioneering screen technology and smart Galaxy AI devices with verified warranty.",
    color: "#3b82f6",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
  },
  lenovo: {
    logo: "💻",
    tag: "Legion & ThinkPad Hub",
    desc: "Smarter technology for all, featuring RTX gaming beast laptops and workplace workstations.",
    color: "#6366f1",
    bg: "linear-gradient(135deg, #180808 0%, #7f1d1d 100%)",
  },
  sony: {
    logo: "📺",
    tag: "Acoustics & Cinematic TV Hub",
    desc: "Immerse in breathtaking Dolby Vision detail with premium Google TV exchanges and industry-leading ANC headphones.",
    color: "#0f172a",
    bg: "linear-gradient(135deg, #050b14 0%, #1e1b4b 100%)",
  },
  dyson: {
    logo: "💨",
    tag: "Smart Appliances Spot",
    desc: "High-end vacuums, air purifiers, and revolutionary hair care directly from authorized distributors.",
    color: "#ec4899",
    bg: "linear-gradient(135deg, #3d052a 0%, #ec4899 100%)",
  },
  mivi: {
    logo: "🎧",
    tag: "Acoustics & Audio Hub",
    desc: "Indian-engineered high-fidelity soundbars and earbuds optimized for deep bass cinema audio.",
    color: "#0d9488",
    bg: "linear-gradient(135deg, #042f2e 0%, #0d9488 100%)",
  },
  zonda: {
    logo: "💎",
    tag: "Fragrances & Luxury Elixirs",
    desc: "Our exclusive signature collection of premium French elixirs, cedarwood logs, and curated luxury offerings.",
    color: "#d97706",
    bg: "linear-gradient(135deg, #2b1c04 0%, #d97706 100%)",
  },
};

const BrandStore = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartAddingId, setCartAddingId] = useState(null);

  const brandKey = brandName?.toLowerCase() || "";
  const theme = BRAND_THEMES[brandKey] || {
    logo: "🛍️",
    tag: "Official Partner Store",
    desc: `Discover high quality products from ${brandName} with verified warranty.`,
    color: "#0d6efd",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        // Filter products matching this brand name (case-insensitive match in title or description)
        const filtered = data.filter((p) => 
          p.name.toLowerCase().includes(brandKey) || 
          p.desc.toLowerCase().includes(brandKey) ||
          (brandKey === "zonda" && p.badge?.toLowerCase().includes("seller"))
        );
        setProducts(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (brandKey) {
      fetchProducts();
    }
  }, [brandKey]);

  const handleAddToCart = async (prodId) => {
    setCartAddingId(prodId);
    await addToCart(prodId, 1);
    setCartAddingId(null);
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        {/* Brand Banner */}
        <div 
          className="p-4 p-md-5 rounded-4 text-white mb-5 shadow-lg position-relative overflow-hidden"
          style={{
            background: theme.bg,
          }}
        >
          <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
            <div className="col-12 col-md-8">
              <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-3" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                {theme.logo} Official Partner
              </span>
              <h1 className="display-4 fw-extrabold mb-3 text-capitalize" style={{ fontWeight: "800" }}>
                {brandName} Store
              </h1>
              <p className="lead text-light-emphasis mb-0" style={{ color: "#cbd5e1" }}>
                {theme.desc}
              </p>
            </div>
            <div className="col-12 col-md-4 text-md-end mt-4 mt-md-0">
              <span className="fs-1 fw-bold opacity-75">{theme.tag}</span>
            </div>
          </div>
        </div>

        {/* Brand Products Grid */}
        <div className="mb-4">
          <h3 className="fw-extrabold mb-4" style={{ color: "#0f172a", fontSize: "24px" }}>
            Available Items ({products.length})
          </h3>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : products.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: "16px" }}>
              <i className="bi bi-search text-muted mb-3" style={{ fontSize: "48px" }}></i>
              <h4 className="fw-bold text-dark">No Products Found</h4>
              <p className="text-muted">We currently don't have active products listed under this brand.</p>
              <button onClick={() => navigate("/products")} className="btn btn-primary btn-sm px-4 py-2 mt-2" style={{ borderRadius: "8px" }}>
                Browse All Products
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {products.map((prod) => (
                <div key={prod.id} className="col-12 col-sm-6 col-lg-3 d-flex align-items-stretch">
                  <div 
                    className="card border-0 shadow-sm overflow-hidden w-100 d-flex flex-column justify-content-between position-relative"
                    style={{
                      borderRadius: "16px",
                      backgroundColor: "#ffffff",
                      transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    }}
                  >
                    {prod.badge && (
                      <span 
                        className="position-absolute badge rounded-pill bg-danger"
                        style={{
                          top: "12px",
                          left: "12px",
                          fontSize: "10px",
                          padding: "5px 10px",
                          zIndex: 1
                        }}
                      >
                        {prod.badge}
                      </span>
                    )}

                    {/* Image Area */}
                    <div 
                      onClick={() => navigate(`/products/${prod.id}`)}
                      className="p-4 d-flex justify-content-center align-items-center cursor-pointer"
                      style={{
                        backgroundColor: "#f8fafc",
                        height: "180px",
                        borderBottom: "1px solid #f1f5f9"
                      }}
                    >
                      <img 
                        src={prod.src} 
                        alt={prod.name} 
                        style={{
                          maxWidth: "85%",
                          maxHeight: "85%",
                          objectFit: "contain",
                          cursor: "pointer"
                        }}
                      />
                    </div>

                    {/* Info Area */}
                    <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        {/* Rating */}
                        <div className="d-flex gap-1 mb-2 text-warning" style={{ fontSize: "11px" }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`bi ${i < prod.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                          ))}
                        </div>

                        <h5 className="fw-bold mb-1" style={{ fontSize: "15px", color: "#1e293b" }}>{prod.name}</h5>
                        <p className="text-muted mb-3" style={{ fontSize: "12px", lineHeight: "1.4", height: "34px", overflow: "hidden" }}>
                          {prod.desc}
                        </p>
                      </div>

                      <div>
                        <div className="d-flex align-items-baseline gap-2 mb-3">
                          <span className="fs-5 fw-bold text-dark">₹{prod.price.toLocaleString("en-IN")}</span>
                          {prod.originalPrice && (
                            <span className="text-muted text-decoration-line-through" style={{ fontSize: "12px" }}>
                              {prod.originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="d-flex gap-2">
                          <button 
                            onClick={() => handleAddToCart(prod.id)}
                            disabled={cartAddingId === prod.id}
                            className="btn btn-primary btn-sm flex-grow-1 py-2 fw-semibold"
                            style={{ borderRadius: "8px" }}
                          >
                            {cartAddingId === prod.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <>
                               <i className="bi bi-cart-plus me-1"></i> Add
                              </>
                            )}
                          </button>
                          <button 
                            onClick={() => navigate(`/products/${prod.id}`)}
                            className="btn btn-light btn-sm py-2 fw-semibold border"
                            style={{ borderRadius: "8px", color: "#64748b" }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BrandStore;
