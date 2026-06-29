import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const API_URL = "http://localhost:5000/api/products";

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch current product
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
        setQuantity(1);

        // Fetch related products (same category)
        const relResponse = await fetch(API_URL);
        if (relResponse.ok) {
          const allProducts = await relResponse.json();
          const filtered = allProducts
            .filter((p) => p.category === data.category && p.id !== data.id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
    window.scrollTo(0, 0);
  }, [id]);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    const result = await addToCart(product.id, quantity);
    setAdding(false);

    if (result.success) {
      triggerToast(`${product.name} added to cart!`);
    } else {
      if (result.error === "Not authenticated" || result.error === "Please log in to add items to your cart.") {
        triggerToast("Please log in to add items to cart.", "warning");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        triggerToast(result.error || "Failed to add item to cart.", "danger");
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <i className="bi bi-exclamation-triangle text-danger display-1 mb-4"></i>
        <h3 className="fw-bold text-dark">Product Not Found</h3>
        <p className="text-muted">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary mt-3 px-4 py-2.5" style={{ borderRadius: "10px" }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  // Calculate discount percentage
  let discountPercentage = 0;
  if (product.originalPrice) {
    const originalPriceNum = parseInt(product.originalPrice.replace(/[^\d]/g, ""), 10);
    if (originalPriceNum > product.price) {
      discountPercentage = Math.round(((originalPriceNum - product.price) / originalPriceNum) * 100);
    }
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container position-relative">
        
        {/* Floating Toast Notification */}
        {toast.show && (
          <div 
            className={`alert alert-${toast.type} alert-dismissible fade show shadow-sm border-0 d-flex align-items-center gap-2`}
            role="alert"
            style={{
              position: "fixed",
              top: "90px",
              right: "24px",
              zIndex: 1050,
              minWidth: "300px",
              borderRadius: "12px",
            }}
          >
            <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : toast.type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-x-circle-fill'}`}></i>
            <div>{toast.message}</div>
            <button type="button" className="btn-close shadow-none" onClick={() => setToast({ show: false, message: "", type: "" })}></button>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-transparent p-0 mb-0" style={{ fontSize: "14px" }}>
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none text-muted">Products</Link></li>
            <li className="breadcrumb-item text-muted text-capitalize">{product.category}</li>
            <li className="breadcrumb-item active text-truncate fw-semibold text-primary" aria-current="page" style={{ maxWidth: "200px" }}>{product.name}</li>
          </ol>
        </nav>

        {/* Product Details Section */}
        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white mb-5">
          <div className="row g-5">
            
            {/* Left Column: Image Card */}
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              <div 
                className="bg-light p-4 rounded-4 d-flex align-items-center justify-content-center w-100" 
                style={{ 
                  height: "400px", 
                  border: "1px solid #f1f5f9",
                  overflow: "hidden"
                }}
              >
                <img 
                  src={product.src.startsWith("http") || product.src.startsWith("data:") ? product.src : `/${product.src}`} 
                  alt={product.name} 
                  style={{ 
                    maxWidth: "90%", 
                    maxHeight: "90%", 
                    objectFit: "contain",
                    transition: "transform 0.3s ease" 
                  }}
                  className="product-detail-img"
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
            </div>

            {/* Right Column: Info & Actions */}
            <div className="col-12 col-md-6 text-start d-flex flex-column justify-content-between">
              <div>
                
                {/* Badge & Category */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1.5 fs-7 fw-semibold text-capitalize">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="badge bg-danger rounded-pill px-3 py-1.5 fs-7 fw-semibold">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Title */}
                <h2 className="fw-extrabold text-dark mb-2" style={{ fontSize: "32px", fontWeight: "800" }}>
                  {product.name}
                </h2>

                {/* Ratings & Reviews */}
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="text-warning d-flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i key={i} className={`bi ${i < product.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                    ))}
                  </div>
                  <span className="text-muted small">({product.rating}.0 Rating / 24 Reviews)</span>
                </div>

                {/* Price Breakdown */}
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="fs-3 fw-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-muted text-decoration-line-through fs-5">{product.originalPrice}</span>
                      {discountPercentage > 0 && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small fw-bold">
                          {discountPercentage}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted mb-4" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                  {product.desc}
                </p>

                {/* Specs/USP List */}
                <div className="row g-3 mb-4 border-top border-bottom py-3 text-muted" style={{ fontSize: "13px" }}>
                  <div className="col-6 d-flex align-items-center gap-2">
                    <i className="bi bi-shield-check text-success fs-5"></i>
                    <span>1 Year Warranty</span>
                  </div>
                  <div className="col-6 d-flex align-items-center gap-2">
                    <i className="bi bi-truck text-success fs-5"></i>
                    <span>Free Shipping (above ₹5K)</span>
                  </div>
                  <div className="col-6 d-flex align-items-center gap-2">
                    <i className="bi bi-arrow-left-right text-success fs-5"></i>
                    <span>7-Day Replacements</span>
                  </div>
                  <div className="col-6 d-flex align-items-center gap-2">
                    <i className="bi bi-box-seam text-success fs-5"></i>
                    <span>Secure Packaging</span>
                  </div>
                </div>

              </div>

              {/* Quantity Selector & Add-To-Cart Action */}
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="input-group input-group-md" style={{ maxWidth: "130px" }}>
                  <button 
                    className="btn btn-outline-secondary border-secondary-subtle bg-light px-3" 
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => prev - 1)}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input 
                    type="text" 
                    className="form-control text-center bg-white border-secondary-subtle fw-semibold" 
                    value={quantity} 
                    readOnly 
                    style={{ pointerEvents: "none" }}
                  />
                  <button 
                    className="btn btn-outline-secondary border-secondary-subtle bg-light px-3" 
                    type="button"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="btn btn-primary btn-lg flex-grow-1 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: "12px", fontSize: "16px", boxShadow: "0 8px 16px rgba(13, 110, 253, 0.15)" }}
                >
                  {adding ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-bag-plus"></i>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="border-bottom pb-3 mb-4 text-start">
              <h4 className="fw-bold text-dark">You May Also Like</h4>
              <p className="text-muted mb-0 small">Recommended products from the same category</p>
            </div>

            <div className="row g-4">
              {relatedProducts.map((prod) => (
                <div key={prod.id} className="col-12 col-sm-6 col-md-3 d-flex align-items-stretch">
                  <div 
                    className="card border-0 shadow-sm overflow-hidden w-100 d-flex flex-column justify-content-between"
                    style={{
                      borderRadius: "16px",
                      backgroundColor: "#ffffff",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/products/${prod.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
                      e.currentTarget.style.border = "1px solid #0d6efd";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.02)";
                      e.currentTarget.style.border = "none";
                    }}
                  >
                    {/* Image Frame */}
                    <div 
                      className="p-3 d-flex justify-content-center align-items-center"
                      style={{
                        backgroundColor: "#f8fafc",
                        height: "150px",
                      }}
                    >
                      <img 
                        src={prod.src.startsWith("http") || prod.src.startsWith("data:") ? prod.src : `/${prod.src}`} 
                        alt={prod.name} 
                        style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }}
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3 text-start d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        <h6 className="fw-bold mb-1 text-dark text-truncate">{prod.name}</h6>
                        <p className="text-muted mb-2 text-truncate small">{prod.desc}</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-primary">₹{prod.price.toLocaleString("en-IN")}</span>
                        <span className="text-muted text-decoration-line-through small" style={{ fontSize: "11px" }}>{prod.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
