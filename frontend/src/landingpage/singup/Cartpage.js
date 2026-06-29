import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { products } from "../product/Productpage";

function Cartpage() {
  const { cart, loading, error, updateCartQuantity, removeFromCart, fetchCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    country: "India"
  });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleQuantityChange = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;

    setActionLoadingId(productId);
    const result = await updateCartQuantity(productId, newQty);
    setActionLoadingId(null);

    if (result.success) {
      triggerToast("Quantity updated successfully!");
    } else {
      triggerToast(result.error || "Failed to update quantity.", "danger");
    }
  };

  const handleRemove = async (productId, productName) => {
    setActionLoadingId(productId);
    const result = await removeFromCart(productId);
    setActionLoadingId(null);

    if (result.success) {
      triggerToast(`${productName} removed from cart.`);
    } else {
      triggerToast(result.error || "Failed to remove item.", "danger");
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    // Field validations
    if (
      !shippingAddress.fullName ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      triggerToast("Please complete all shipping address fields.", "warning");
      return;
    }

    setActionLoadingId("checkout");

    try {
      const items = cartItemsWithDetails.map((item) => ({
        productId: item.productId,
        name: item.details.name,
        category: item.details.category,
        price: item.price,
        quantity: item.quantity,
        src: item.details.src
      }));

      const pricing = {
        subtotal,
        GST: tax,
        shippingCharges: shipping,
        totalAmount: grandTotal
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items,
          shippingAddress,
          pricing
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to process order.");
      }

      setCheckoutSuccess(true);
      setIsCheckingOut(false);
      triggerToast("Order placed successfully! Thank you for shopping with Zonda.");
      
      // Refresh cart to empty state in the layout context
      fetchCart();
    } catch (err) {
      console.error("Place Order API Error:", err);
      triggerToast(err.message || "Order placement failed. Please try again.", "danger");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="card glass-panel text-center p-5 shadow border-0" style={{ maxWidth: "450px", borderRadius: "20px" }}>
          <i className="bi bi-cart-x text-warning" style={{ fontSize: "56px" }}></i>
          <h4 className="fw-bold mt-4 text-dark">Your Cart is Locked</h4>
          <p className="text-muted small">Please log in to view and manage your shopping cart items.</p>
          <Link to="/login" className="btn btn-primary mt-3 px-4 py-2" style={{ borderRadius: "10px" }}>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (checkoutSuccess) {
    return (
      <div className="container-fluid d-flex align-items-center justify-content-center py-5 animate-fade-in-up" style={{ minHeight: "80vh" }}>
        <div className="card glass-panel text-center p-5 shadow-lg border-0" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "80px", height: "80px" }}>
            <i className="bi bi-patch-check-fill" style={{ fontSize: "40px" }}></i>
          </div>
          <h3 className="fw-bold text-dark mb-2">Order Confirmed!</h3>
          <p className="text-muted">Your order has been successfully placed. You can track its status inside your Order History dashboard.</p>
          <div className="mt-4 d-flex gap-3 justify-content-center">
            <Link to="/orders" className="btn btn-primary px-4 py-2.5" style={{ borderRadius: "10px", fontSize: "14px" }}>
              View My Orders
            </Link>
            <button onClick={() => setCheckoutSuccess(false)} className="btn btn-outline-secondary px-4 py-2.5" style={{ borderRadius: "10px", fontSize: "14px" }}>
              Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Map cart items to static product details
  const cartItemsWithDetails = (cart.items || [])
    .map((item) => {
      const details = products.find((p) => p.id === item.productId);
      return details ? { ...item, details } : null;
    })
    .filter(Boolean);

  const subtotal = cartItemsWithDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const grandTotal = subtotal + shipping + tax;

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
            <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
            <div>{toast.message}</div>
            <button type="button" className="btn-close shadow-none" onClick={() => setToast({ show: false, message: "", type: "" })}></button>
          </div>
        )}

        <div className="border-bottom pb-3 mb-5">
          <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "12px", letterSpacing: "2px" }}>
            {isCheckingOut ? "Checkout Process" : "Your Bag"}
          </span>
          <h2 className="fw-extrabold mt-1 mb-2" style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800" }}>
            {isCheckingOut ? "Shipping Address" : "Shopping Cart"}
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: "15px" }}>
            {isCheckingOut ? "Enter your shipping details below to place order" : `${cartItemsWithDetails.length} ${cartItemsWithDetails.length === 1 ? "item" : "items"} in your cart.`}
          </p>
        </div>

        {cartItemsWithDetails.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center rounded-4 bg-white">
            <i className="bi bi-bag-x text-muted display-3 mb-4"></i>
            <h4 className="fw-bold text-dark">Your cart is empty</h4>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: "350px" }}>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="btn btn-primary px-4 py-2.5 fw-semibold" style={{ borderRadius: "10px", fontSize: "14px" }}>
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            
            {/* Left Column: Cart list or Shipping details form */}
            <div className="col-12 col-lg-8">
              {!isCheckingOut ? (
                <div className="d-flex flex-column gap-3">
                  {cartItemsWithDetails.map((item) => (
                    <div 
                      key={item.productId} 
                      className="card border-0 shadow-sm p-3 rounded-4 bg-white"
                      style={{ transition: "all 0.2s ease" }}
                    >
                      <div className="row align-items-center g-3">
                        
                        {/* Image */}
                        <div className="col-4 col-sm-2 text-center">
                          <div className="bg-light p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ height: "80px" }}>
                            <img 
                              src={item.details.src.startsWith("http") ? item.details.src : `/${item.details.src}`} 
                              alt={item.details.name} 
                              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="col-8 col-sm-4 text-start">
                          <span className="badge bg-secondary-subtle text-secondary rounded-pill mb-1" style={{ fontSize: "10px" }}>
                            {item.details.category}
                          </span>
                          <h6 className="fw-bold mb-1 text-dark text-truncate">{item.details.name}</h6>
                          <span className="text-muted small">Unit Price: ₹{item.price.toLocaleString()}</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="col-6 col-sm-3 d-flex align-items-center justify-content-start justify-content-sm-center">
                          <div className="input-group input-group-sm" style={{ maxWidth: "110px" }}>
                            <button 
                              className="btn btn-outline-secondary border-secondary-subtle bg-light" 
                              type="button"
                              disabled={actionLoadingId === item.productId || item.quantity <= 1}
                              onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <input 
                              type="text" 
                              className="form-control text-center bg-white border-secondary-subtle fw-semibold" 
                              value={item.quantity} 
                              readOnly 
                              style={{ pointerEvents: "none" }}
                            />
                            <button 
                              className="btn btn-outline-secondary border-secondary-subtle bg-light" 
                              type="button"
                              disabled={actionLoadingId === item.productId}
                              onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>

                        {/* Subtotal & Delete */}
                        <div className="col-6 col-sm-3 d-flex align-items-center justify-content-end justify-content-sm-end gap-3">
                          <div className="text-end">
                            <p className="mb-0 fw-bold text-dark">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <button 
                            className="btn btn-link text-danger p-1" 
                            disabled={actionLoadingId === item.productId}
                            onClick={() => handleRemove(item.productId, item.details.name)}
                            style={{ fontSize: "18px" }}
                          >
                            {actionLoadingId === item.productId ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <i className="bi bi-trash"></i>
                            )}
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white animate-fade-in-up">
                  <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-3">
                    <button className="btn btn-light rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }} onClick={() => setIsCheckingOut(false)}>
                      <i className="bi bi-arrow-left"></i>
                    </button>
                    <h5 className="fw-bold mb-0 text-dark">Delivery Address</h5>
                  </div>
                  
                  <form onSubmit={handlePlaceOrder}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label text-muted small fw-semibold">Full Name</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-person"></i></span>
                          <input 
                            type="text" 
                            name="fullName" 
                            className="form-control border-start-0 shadow-none" 
                            placeholder="e.g. Rambilas Sah" 
                            value={shippingAddress.fullName} 
                            onChange={handleAddressChange} 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label text-muted small fw-semibold">Street Address</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-geo-alt"></i></span>
                          <input 
                            type="text" 
                            name="addressLine1" 
                            className="form-control border-start-0 shadow-none" 
                            placeholder="e.g. Apartment, Suite, Unit, Street Number" 
                            value={shippingAddress.addressLine1} 
                            onChange={handleAddressChange} 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">City</label>
                        <input 
                          type="text" 
                          name="city" 
                          className="form-control shadow-none" 
                          placeholder="e.g. Mumbai" 
                          value={shippingAddress.city} 
                          onChange={handleAddressChange} 
                          required 
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">State</label>
                        <input 
                          type="text" 
                          name="state" 
                          className="form-control shadow-none" 
                          placeholder="e.g. Maharashtra" 
                          value={shippingAddress.state} 
                          onChange={handleAddressChange} 
                          required 
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">Postal / ZIP Code</label>
                        <input 
                          type="text" 
                          name="postalCode" 
                          className="form-control shadow-none" 
                          placeholder="e.g. 400001" 
                          value={shippingAddress.postalCode} 
                          onChange={handleAddressChange} 
                          required 
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">Phone Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-telephone"></i></span>
                          <input 
                            type="tel" 
                            name="phone" 
                            className="form-control border-start-0 shadow-none" 
                            placeholder="e.g. 9876543210" 
                            value={shippingAddress.phone} 
                            onChange={handleAddressChange} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                <h5 className="fw-bold mb-4 text-dark">Order Summary</h5>
                
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex justify-content-between text-muted">
                    <span style={{ fontSize: "14px" }}>Subtotal</span>
                    <span className="fw-semibold text-dark">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between text-muted">
                    <span style={{ fontSize: "14px" }}>Shipping</span>
                    <span className="fw-semibold text-dark">
                      {shipping === 0 ? <span className="text-success">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between text-muted">
                    <span style={{ fontSize: "14px" }}>GST (18%)</span>
                    <span className="fw-semibold text-dark">₹{tax.toLocaleString()}</span>
                  </div>

                  {shipping > 0 && !isCheckingOut && (
                    <div className="alert alert-info py-2 px-3 mb-0" style={{ fontSize: "11px", borderRadius: "8px" }}>
                      <i className="bi bi-info-circle me-1.5"></i>
                      Add <strong>₹{(5000 - subtotal).toLocaleString()}</strong> more to get free shipping!
                    </div>
                  )}
                </div>

                <div className="border-top pt-3 mb-4">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold text-dark">Total Amount</span>
                    <span className="fw-extrabold text-primary fs-5">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {isCheckingOut ? (
                  <div className="d-flex flex-column gap-2">
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={actionLoadingId === "checkout"}
                      className="btn btn-success w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                      style={{ borderRadius: "12px", fontSize: "15px", boxShadow: "0 8px 16px rgba(25, 135, 84, 0.15)" }}
                    >
                      {actionLoadingId === "checkout" ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Placing Order...
                        </>
                      ) : (
                        <>
                          Place Order (COD)
                          <i className="bi bi-check2-circle"></i>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setIsCheckingOut(false)}
                      className="btn btn-outline-secondary w-100 py-2.5 fw-semibold"
                      style={{ borderRadius: "12px", fontSize: "14px" }}
                    >
                      Back to Cart Review
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: "12px", fontSize: "15px", boxShadow: "0 8px 16px rgba(13, 110, 253, 0.15)" }}
                  >
                    Proceed to Checkout
                    <i className="bi bi-arrow-right"></i>
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Cartpage;
