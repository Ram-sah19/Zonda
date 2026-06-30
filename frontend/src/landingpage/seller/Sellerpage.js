import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";

const Sellerpage = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState("list");
  
  // Form states for new/edit product
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("smartphones");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileBase64, setImageFileBase64] = useState(null);

  const API_URL = "http://localhost:5000/api/products";

  // Fetch only this seller's products
  const fetchSellerProducts = useCallback(async () => {
    if (!token || !user?.isSeller) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/seller/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, user?.isSeller]);

  useEffect(() => {
    fetchSellerProducts();
  }, [fetchSellerProducts]);

  // Handle file uploads (converts to base64)
  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFileBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit product creation or update
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!name || !desc || !price) {
      setError("Please fill in all required fields.");
      return;
    }

    const finalImage = imageFileBase64 || imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      category,
      desc,
      price: Number(price),
      originalPrice: originalPrice ? `₹${Number(originalPrice).toLocaleString("en-IN")}` : "",
      src: finalImage,
      stock: Number(stock),
      badge: "Seller Item"
    };

    try {
      let response;
      if (editingProduct) {
        // Edit existing product
        response = await fetch(`${API_URL}/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new product
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save product");
      }

      // Reset form
      resetForm();
      fetchSellerProducts();
      setActiveTab("list");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setDesc(product.desc);
    setPrice(product.price.toString());
    setOriginalPrice(product.originalPrice ? product.originalPrice.replace(/[^\d]/g, "") : "");
    setStock(product.stock ? product.stock.toString() : "10");
    if (product.src.startsWith("data:")) {
      setImageFileBase64(product.src);
      setImageUrl("");
    } else {
      setImageUrl(product.src);
      setImageFileBase64(null);
    }
    setActiveTab("add");
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }
      fetchSellerProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setName("");
    setCategory("smartphones");
    setDesc("");
    setPrice("");
    setOriginalPrice("");
    setStock("10");
    setImageUrl("");
    setImageFileBase64(null);
  };

  // 1. Unified "Become a Seller" Landing Page for Guests and Buyers (non-sellers)
  if (!user || !user.isSeller) {
    return (
      <div 
        className="min-vh-100 py-5"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <div className="container py-4">
          
          {/* Active Buyer Warning / Info Alert */}
          {user && !user.isSeller && (
            <div className="alert alert-info border-0 rounded-4 p-3 mb-5 d-flex align-items-center gap-3 shadow-sm mx-auto" style={{ maxWidth: "900px" }}>
              <i className="bi bi-info-circle-fill fs-4 text-primary"></i>
              <div>
                <h6 className="fw-bold mb-1">Logged in as a Buyer</h6>
                <p className="mb-0 text-muted small">
                  Buyer accounts cannot be converted to seller accounts. To start selling, please create a separate seller account. Submitting the registration form will automatically log you out of your current buyer session.
                </p>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <div className="row justify-content-center text-center mb-5">
            <div className="col-12 col-lg-8 position-relative">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 fw-bold text-uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>
                Merchant Marketplace
              </span>
              <h1 className="display-4 fw-extrabold mb-3 text-dark" style={{ fontWeight: "800" }}>
                Launch Your Business on Zonda
              </h1>
              <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: "680px" }}>
                Reach millions of tech enthusiasts and electronics buyers. Manage your inventory in real-time, scale your brand, and keep 100% of your earnings.
              </p>
              <a 
                href="/seller/register" 
                className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow-sm"
                style={{ borderRadius: "12px", fontSize: "16px" }}
              >
                Register as a Seller
              </a>
            </div>
          </div>

          {/* Features / Benefits Grid */}
          <div className="row g-4 mb-5 justify-content-center">
            <div className="col-12 text-center mb-2">
              <h3 className="fw-bold text-dark">Why Sell on Zonda?</h3>
              <p className="text-muted">Take advantage of our state-of-the-art e-commerce tools</p>
            </div>
            
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-4 transition-all hover-translate-up" style={{ backgroundColor: "#ffffff" }}>
                <div className="p-3 bg-primary-subtle text-primary rounded-3 d-inline-block mb-3" style={{ width: "fit-content" }}>
                  <i className="bi bi-graph-up-arrow fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">Real-Time Analytics</h5>
                <p className="text-muted small mb-0">Track product page views, stock levels, and monitor sales trends instantly via your personalized control panel.</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-4 transition-all hover-translate-up" style={{ backgroundColor: "#ffffff" }}>
                <div className="p-3 bg-success-subtle text-success rounded-3 d-inline-block mb-3" style={{ width: "fit-content" }}>
                  <i className="bi bi-currency-dollar fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">Zero Commission Fees</h5>
                <p className="text-muted small mb-0">Zonda believes in supporting creators. Keep 100% of the listed price on every single transaction with zero hidden cuts.</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-4 transition-all hover-translate-up" style={{ backgroundColor: "#ffffff" }}>
                <div className="p-3 bg-warning-subtle text-warning rounded-3 d-inline-block mb-3" style={{ width: "fit-content" }}>
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">Access Active Customers</h5>
                <p className="text-muted small mb-0">Instant placement on our frontend collections, putting your products in front of thousands of high-intent electronics shoppers.</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-4 transition-all hover-translate-up" style={{ backgroundColor: "#ffffff" }}>
                <div className="p-3 bg-info-subtle text-info rounded-3 d-inline-block mb-3" style={{ width: "fit-content" }}>
                  <i className="bi bi-wallet2 fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">Secure Automated Payouts</h5>
                <p className="text-muted small mb-0">Rest easy with encrypted escrow payment flows, receiving payouts directly into your merchant bank account within 2-3 business days.</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm p-4 h-100 rounded-4 transition-all hover-translate-up" style={{ backgroundColor: "#ffffff" }}>
                <div className="p-3 bg-danger-subtle text-danger rounded-3 d-inline-block mb-3" style={{ width: "fit-content" }}>
                  <i className="bi bi-sliders fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">Robust Listing Controls</h5>
                <p className="text-muted small mb-0">Easily create new listings, edit descriptions, adjust stock, upload base64 images, and delete items from the dashboard.</p>
              </div>
            </div>
          </div>

          {/* Requirements & Documentation Checklist */}
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-5 mx-auto" style={{ maxWidth: "900px", backgroundColor: "#ffffff" }}>
            <div className="row align-items-center">
              <div className="col-12 col-md-6 mb-4 mb-md-0">
                <span className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: "1px" }}>Onboarding Checklist</span>
                <h3 className="fw-bold text-dark mt-1 mb-3">What do I need to register?</h3>
                <p className="text-muted small">We require verification of standard merchant credentials to protect our marketplace community and verify payouts.</p>
                <div className="d-flex flex-column gap-2.5 mt-4">
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span>Contact details & personal login credentials</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span>Registered Business Name & Address</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span>Tax / GST identification details</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span>Merchant bank account information</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span>Identity document (Passport, PAN, GST License, etc.)</span>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 text-center">
                <div className="p-4 rounded-4 bg-light d-flex flex-column align-items-center justify-content-center border" style={{ minHeight: "220px" }}>
                  <i className="bi bi-file-earmark-check text-primary mb-3" style={{ fontSize: "52px" }}></i>
                  <h5 className="fw-bold mb-2">Ready to Start?</h5>
                  <p className="text-muted small mb-4">Registration takes less than 5 minutes. Set up your listings immediately after signup.</p>
                  <a href="/seller/register" className="btn btn-primary px-4 py-2.5 fw-semibold" style={{ borderRadius: "8px" }}>
                    Create Seller Account
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="mx-auto mb-4" style={{ maxWidth: "900px" }}>
            <h3 className="fw-bold text-dark text-center mb-4">Frequently Asked Questions</h3>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-4 bg-white rounded-4 border shadow-none h-100">
                  <h6 className="fw-bold text-dark mb-2">Do I need a separate email address to sell?</h6>
                  <p className="text-muted small mb-0">Yes. To safeguard buyer-seller accounts and guarantee order integrity, a separate registration with a different email is required.</p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-4 bg-white rounded-4 border shadow-none h-100">
                  <h6 className="fw-bold text-dark mb-2">Can I convert my existing buyer account?</h6>
                  <p className="text-muted small mb-0">No. Buyer accounts cannot be converted. You must sign up for a dedicated seller account using our registration page.</p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-4 bg-white rounded-4 border shadow-none h-100">
                  <h6 className="fw-bold text-dark mb-2">Are there any upfront listing fees?</h6>
                  <p className="text-muted small mb-0">No, Zonda offers a completely free portal for verified sellers. You pay nothing to list products or display your store catalog.</p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-4 bg-white rounded-4 border shadow-none h-100">
                  <h6 className="fw-bold text-dark mb-2">How do payouts work?</h6>
                  <p className="text-muted small mb-0">Once an order is shipped and marked complete, funds are automatically transferred to the bank account listed in your seller details.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 3. Main Seller Dashboard View
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        {/* Dashboard Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
          <div>
            <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "12px", letterSpacing: "1.5px" }}>Control Center</span>
            <h2 className="fw-extrabold mt-1 mb-0" style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800" }}>Seller Dashboard</h2>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>Welcome back, <span className="fw-semibold text-dark">{user.name}</span>. Manage your product listings and sales.</p>
          </div>
          
          <div className="d-flex gap-2">
            <button 
              onClick={() => { resetForm(); setActiveTab("list"); }}
              className={`btn btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-1.5 ${activeTab === "list" ? "btn-dark" : "btn-outline-dark"}`}
              style={{ borderRadius: "8px" }}
            >
              <i className="bi bi-box-seam"></i> My Products
            </button>
            <button 
              onClick={() => { resetForm(); setActiveTab("add"); }}
              className={`btn btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-1.5 ${activeTab === "add" && !editingProduct ? "btn-primary" : "btn-outline-primary"}`}
              style={{ borderRadius: "8px" }}
            >
              <i className="bi bi-plus-lg"></i> {editingProduct ? "Edit Product" : "Add Product"}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger mb-4" role="alert">{error}</div>}

        {/* Tab 1: Product Listing Grid */}
        {activeTab === "list" && (
          <div>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: "16px" }}>
                <i className="bi bi-box2 text-muted mb-3" style={{ fontSize: "48px" }}></i>
                <h4 className="fw-bold mb-2">No Products Listed Yet</h4>
                <p className="text-muted mb-4">Get started by listing your first product in the marketplace!</p>
                <button 
                  onClick={() => setActiveTab("add")} 
                  className="btn btn-primary px-4 py-2 fw-semibold"
                  style={{ borderRadius: "8px" }}
                >
                  <i className="bi bi-plus-lg me-1"></i> Add Product
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {products.map((product) => (
                  <div key={product.id} className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex align-items-stretch">
                    <div className="card border-0 shadow-sm w-100 overflow-hidden d-flex flex-column justify-content-between" style={{ borderRadius: "16px", backgroundColor: "#ffffff" }}>
                      
                      {/* Product Image */}
                      <div className="p-3 bg-light d-flex align-items-center justify-content-center" style={{ height: "180px", borderBottom: "1px solid #f1f5f9" }}>
                        <img 
                          src={product.src} 
                          alt={product.name} 
                          style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                        />
                      </div>

                      {/* Info */}
                      <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                        <div>
                          <span className="badge bg-secondary-subtle text-secondary text-uppercase fw-semibold mb-2" style={{ fontSize: "10px" }}>
                            {product.category}
                          </span>
                          <h6 className="fw-bold text-dark mb-1" style={{ fontSize: "16px" }}>{product.name}</h6>
                          <p className="text-muted mb-3" style={{ fontSize: "12px", lineHeight: "1.4", height: "34px", overflow: "hidden" }}>
                            {product.desc}
                          </p>
                        </div>

                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fs-5 fw-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                            <span className="badge bg-light text-dark border px-2 py-1.5" style={{ fontSize: "11px" }}>
                              Stock: {product.stock ?? 10}
                            </span>
                          </div>

                          <div className="d-flex gap-2">
                            <button 
                              onClick={() => handleEditClick(product)}
                              className="btn btn-outline-secondary btn-sm flex-grow-1 py-2 fw-semibold"
                              style={{ borderRadius: "8px", fontSize: "12px" }}
                            >
                              <i className="bi bi-pencil me-1"></i> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(product.id)}
                              className="btn btn-outline-danger btn-sm py-2 px-2.5"
                              style={{ borderRadius: "8px", fontSize: "12px" }}
                              title="Delete Product"
                            >
                              <i className="bi bi-trash"></i>
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
        )}

        {/* Tab 2: Create / Edit Product Form */}
        {activeTab === "add" && (
          <div className="card border-0 shadow-sm p-4 p-md-5 mx-auto" style={{ borderRadius: "20px", maxWidth: "800px" }}>
            <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
              <i className="bi bi-journal-plus text-primary"></i> 
              {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Product"}
            </h4>

            <form onSubmit={handleSubmitProduct}>
              <div className="row g-3 mb-4">
                
                {/* Product Name */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-muted small mb-1">Product Title *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. iPhone 15 Pro Max"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Category Selection */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Category *</label>
                  <select 
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="audio">Audio & Acoustic</option>
                    <option value="smartwatches">Smartwatches</option>
                    <option value="tvs">TVs & Audio</option>
                    <option value="gaming">Gaming Devices</option>
                    <option value="appliances">Smart Appliances</option>
                    <option value="cameras">Cameras & Photography</option>
                    <option value="accessories">Accessories</option>
                    <option value="monitors">Monitors & Screens</option>
                  </select>
                </div>

                {/* Stock Count */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Stock / Inventory *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    min="0"
                    required
                  />
                </div>

                {/* Price */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Discount Price (in ₹) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 129000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                {/* Original Price */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Original Price (optional, in ₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="e.g. 139999"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-muted small mb-1">Product Description *</label>
                  <textarea 
                    className="form-control" 
                    rows={4}
                    placeholder="Write a compelling description outlining features, color, storage, and warranty..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                  />
                </div>

                {/* Product Image URL Input */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-muted small mb-1">Image URL</label>
                  <input 
                    type="text" 
                    className="form-control mb-2" 
                    placeholder="Enter absolute web address for the product image..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <div className="text-center my-2 text-muted fw-semibold small">OR</div>
                </div>

                {/* Product Image File Input */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-muted small mb-1">Upload Product Image (converts to Base64)</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                </div>

                {/* Preview Image */}
                {(imageFileBase64 || imageUrl) && (
                  <div className="col-12 mt-3 text-center">
                    <label className="form-label fw-semibold text-muted small mb-2 d-block">Image Preview</label>
                    <img 
                      src={imageFileBase64 || imageUrl} 
                      alt="Preview" 
                      style={{ maxHeight: "150px", maxWidth: "200px", objectFit: "contain", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px" }}
                    />
                  </div>
                )}

              </div>

              {/* Submit Row */}
              <div className="d-flex justify-content-end gap-2 pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
                <button 
                  type="button" 
                  onClick={() => { resetForm(); setActiveTab("list"); }}
                  className="btn btn-light px-4 py-2.5 fw-semibold"
                  style={{ borderRadius: "8px" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary px-5 py-2.5 fw-bold"
                  style={{ borderRadius: "8px" }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : editingProduct ? "Update Product" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Sellerpage;
