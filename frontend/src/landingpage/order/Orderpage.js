import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Orderpage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Fetch Orders Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Processing":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      case "Shipped":
        return "bg-warning-subtle text-warning border border-warning-subtle";
      case "Delivered":
        return "bg-success-subtle text-success border border-success-subtle";
      case "Cancelled":
        return "bg-danger-subtle text-danger border border-danger-subtle";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="card glass-panel text-center p-5 shadow border-0" style={{ maxWidth: "450px", borderRadius: "20px" }}>
          <i className="bi bi-shield-lock-fill text-warning" style={{ fontSize: "56px" }}></i>
          <h4 className="fw-bold mt-4 text-dark">Access Restricted</h4>
          <p className="text-muted small">Please log in to view and track your e-commerce orders history.</p>
          <Link to="/login" className="btn btn-primary mt-3 px-4 py-2" style={{ borderRadius: "10px" }}>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        {/* Page Header */}
        <div className="border-bottom pb-3 mb-5">
          <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "12px", letterSpacing: "2px" }}>Dashboard</span>
          <h2 className="fw-extrabold mt-1 mb-2" style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800" }}>Order History</h2>
          <p className="text-muted mb-0" style={{ fontSize: "15px" }}>
            View status and manage all past and current orders.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading orders...</span>
            </div>
            <p className="text-muted mt-3">Retrieving your order records...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger border-0 shadow-sm rounded-4 p-4 d-flex align-items-center gap-3" role="alert">
            <i className="bi bi-exclamation-octagon-fill fs-3"></i>
            <div>
              <h6 className="fw-bold mb-1">Failed to load orders</h6>
              <p className="mb-0 text-muted small">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="card border-0 shadow-sm p-5 text-center rounded-4 bg-white">
            <i className="bi bi-receipt-cutoff text-muted display-3 mb-4"></i>
            <h4 className="fw-bold text-dark">No orders found</h4>
            <p className="text-muted mx-auto mb-4" style={{ maxWidth: "350px" }}>
              You haven't placed any orders yet. Explore our premium catalog and check out some amazing tech gear!
            </p>
            <Link to="/products" className="btn btn-primary px-4 py-2.5 fw-semibold" style={{ borderRadius: "10px", fontSize: "14px" }}>
              Browse Catalog
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="d-flex flex-column gap-4">
            {orders.map((order) => (
              <div key={order._id} className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                
                {/* Order Summary Header Panel */}
                <div className="bg-light px-4 py-3 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div className="d-flex gap-4 flex-wrap">
                    <div>
                      <span className="text-muted small d-block uppercase-tracking">Order Placed</span>
                      <span className="fw-semibold text-dark small">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-muted small d-block uppercase-tracking">Order ID</span>
                      <span className="fw-semibold text-dark small" style={{ fontFamily: "monospace" }}>{order._id}</span>
                    </div>
                    <div>
                      <span className="text-muted small d-block uppercase-tracking">Total Amount</span>
                      <span className="fw-bold text-primary small">₹{order.pricing.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`badge px-3 py-2 rounded-pill fs-7 fw-semibold ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Order Details Body */}
                <div className="card-body p-4">
                  <div className="row g-4">
                    
                    {/* Products Purchased */}
                    <div className="col-12 col-lg-8 border-end-lg">
                      <h6 className="fw-bold text-dark mb-3">Items Ordered</h6>
                      <div className="d-flex flex-column gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="d-flex align-items-center justify-content-between gap-3 pb-3 border-bottom-dashed">
                            <div className="d-flex align-items-center gap-3">
                              <div className="bg-light p-1.5 rounded-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                                <img 
                                  src={item.src.startsWith("http") ? item.src : `/${item.src}`} 
                                  alt={item.name} 
                                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                />
                              </div>
                              <div className="text-start">
                                <span className="badge bg-secondary-subtle text-secondary rounded-pill mb-0.5" style={{ fontSize: "9px" }}>
                                  {item.category}
                                </span>
                                <h6 className="fw-bold mb-0 text-dark text-truncate" style={{ maxWidth: "250px", fontSize: "14px" }}>
                                  {item.name}
                                </h6>
                                <span className="text-muted small">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="text-end">
                              <span className="fw-bold text-dark text-nowrap">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Payment Panel */}
                    <div className="col-12 col-lg-4">
                      <div className="ps-0 ps-lg-3">
                        <h6 className="fw-bold text-dark mb-3">Shipping Details</h6>
                        <p className="text-dark fw-semibold mb-1 small">{order.shippingAddress.fullName}</p>
                        <p className="text-muted small mb-1">{order.shippingAddress.addressLine1}</p>
                        <p className="text-muted small mb-1">
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                        </p>
                        <p className="text-muted small mb-3">
                          <i className="bi bi-telephone-fill me-1"></i> {order.shippingAddress.phone}
                        </p>

                        <h6 className="fw-bold text-dark mb-2">Payment Mode</h6>
                        <div className="d-flex justify-content-between align-items-center bg-light p-2.5 rounded-3">
                          <span className="text-muted small">{order.paymentDetails.paymentMethod}</span>
                          <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill fw-semibold" style={{ fontSize: "10px" }}>
                            {order.paymentDetails.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Pricing Summary */}
                <div className="bg-light-subtle px-4 py-2.5 border-top d-flex justify-content-end text-muted small gap-4 flex-wrap">
                  <div>Subtotal: <span className="fw-semibold text-dark">₹{order.pricing.subtotal.toLocaleString()}</span></div>
                  <div>GST (18%): <span className="fw-semibold text-dark">₹{order.pricing.GST.toLocaleString()}</span></div>
                  <div>Shipping: <span className="fw-semibold text-dark">{order.pricing.shippingCharges === 0 ? "FREE" : `₹${order.pricing.shippingCharges}`}</span></div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Orderpage;
