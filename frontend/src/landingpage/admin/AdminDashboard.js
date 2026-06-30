import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Active sub-panel state
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [logs, setLogs] = useState([]);

  // Form states
  const [newCategory, setNewCategory] = useState({ name: "", subcategories: "" });
  const [newCoupon, setNewCoupon] = useState({ code: "", discountType: "percentage", discountValue: "", expiryDate: "" });
  
  // Modals / Editing states
  const [editingProduct, setEditingProduct] = useState(null);

  // Status/loading feedback states
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState({ message: "", type: "" });

  // Security Redirect: If not logged in, or not an admin, redirect immediately
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, token, navigate]);

  // Fetch data depending on active tab
  useEffect(() => {
    if (!user || !user.isAdmin || !token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        if (activeTab === "overview") {
          const res = await fetch("http://localhost:5000/api/admin/stats", { headers });
          if (res.ok) {
            const data = await res.json();
            setStats(data.metrics);
          }
        } else if (activeTab === "users") {
          const res = await fetch("http://localhost:5000/api/admin/users", { headers });
          if (res.ok) setUsers(await res.json());
        } else if (activeTab === "products") {
          const res = await fetch("http://localhost:5000/api/admin/products", { headers });
          if (res.ok) setProducts(await res.json());
        } else if (activeTab === "categories") {
          const res = await fetch("http://localhost:5000/api/admin/categories", { headers });
          if (res.ok) setCategories(await res.json());
        } else if (activeTab === "orders") {
          const res = await fetch("http://localhost:5000/api/admin/orders", { headers });
          if (res.ok) setOrders(await res.json());
        } else if (activeTab === "promotions") {
          const res = await fetch("http://localhost:5000/api/admin/coupons", { headers });
          if (res.ok) setCoupons(await res.json());
        } else if (activeTab === "delivery") {
          const resUsers = await fetch("http://localhost:5000/api/admin/users", { headers });
          if (resUsers.ok) setUsers(await resUsers.json());
          const resOrders = await fetch("http://localhost:5000/api/admin/orders", { headers });
          if (resOrders.ok) setOrders(await resOrders.json());
        } else if (activeTab === "logs" && user.adminRole === "Super Admin") {
          const res = await fetch("http://localhost:5000/api/admin/logs", { headers });
          if (res.ok) setLogs(await res.json());
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user, token]);

  // Trigger feedback banner
  const triggerFeedback = (msg, type = "success") => {
    setActionFeedback({ message: msg, type });
    setTimeout(() => setActionFeedback({ message: "", type: "" }), 3500);
  };

  // 1. User moderation (Suspend/Unsuspend)
  const handleToggleSuspension = async (targetUser) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${targetUser._id}/suspend`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isSuspended: !targetUser.isSuspended }),
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === targetUser._id ? { ...u, isSuspended: !u.isSuspended } : u));
        triggerFeedback(`Account status for ${targetUser.email} updated successfully!`);
      } else {
        const errData = await res.json();
        triggerFeedback(errData.message || "Failed to update user status", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 2. Admin role updates (Super Admin only)
  const handleChangeRole = async (targetUser, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${targetUser._id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === targetUser._id ? { ...u, adminRole: newRole } : u));
        triggerFeedback(`Administrator role updated to ${newRole}`);
      } else {
        const errData = await res.json();
        triggerFeedback(errData.message || "Failed to update admin role", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 3. Seller Status Approvals (Verify/Suspend)
  const handleUpdateSellerStatus = async (seller, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/sellers/${seller._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === seller._id ? { ...u, sellerStatus: newStatus } : u));
        triggerFeedback(`Seller registration for ${seller.name} is now: ${newStatus}`);
      } else {
        const errData = await res.json();
        triggerFeedback(errData.message || "Failed to update seller status", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 4. Product Editing
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        setEditingProduct(null);
        triggerFeedback("Product details modified successfully!");
      } else {
        triggerFeedback("Failed to update product details", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 5. Product Deletion
  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm("Are you sure you want to permanently delete this product from the marketplace?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${prodId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== prodId));
        triggerFeedback("Product deleted successfully.");
      } else {
        triggerFeedback("Failed to delete product", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 7. Delivery Partner Verification (Approve / Suspend / Activate)
  const handleUpdateDeliveryPartnerStatus = async (partner, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/delivery-partners/${partner._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === partner._id ? { ...u, deliveryPartnerStatus: newStatus } : u));
        triggerFeedback(`Delivery Partner: ${partner.name} status updated to: ${newStatus}`);
      } else {
        const errData = await res.json();
        triggerFeedback(errData.message || "Failed to update delivery partner status", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 8. Manual assignment
  const handleManualAssignment = async (orderId, partnerId) => {
    if (!partnerId) {
      triggerFeedback("Please select a delivery partner first", "danger");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/assign-manual`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryPartnerId: partnerId }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map(o => o._id === orderId ? updated.order : o));
        triggerFeedback("Delivery partner assigned successfully!");
      } else {
        const errData = await res.json();
        triggerFeedback(errData.message || "Failed manual assignment", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 9. Auto assignment
  const handleAutoAssignment = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/assign-auto`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map(o => o._id === orderId ? updated.order : o));
        triggerFeedback(updated.message || "Auto-assigned successfully!");
      } else {
        const errData = await res.json();
        triggerFeedback(errData.message || "Failed auto assignment", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 6. Category CRUD
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      const subArr = newCategory.subcategories ? newCategory.subcategories.split(",").map(s => s.trim()) : [];
      const res = await fetch("http://localhost:5000/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory.name, subcategories: subArr }),
      });
      if (res.ok) {
        const addedCat = await res.json();
        setCategories([...categories, addedCat]);
        setNewCategory({ name: "", subcategories: "" });
        triggerFeedback("New product category registered.");
      } else {
        const errData = await res.json();
        triggerFeedback(errData.message || "Failed to create category", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/categories/${catId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCategories(categories.filter(c => c._id !== catId));
        triggerFeedback("Category removed.");
      } else {
        triggerFeedback("Failed to remove category", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 7. Order Status Moderation
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        triggerFeedback(`Order status set to: ${newStatus}`);
      } else {
        triggerFeedback("Failed to update order status", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // 8. Coupon CRUD
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountValue || !newCoupon.expiryDate) return;
    try {
      const res = await fetch("http://localhost:5000/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCoupon),
      });
      if (res.ok) {
        const addedC = await res.json();
        setCoupons([...coupons, addedC]);
        setNewCoupon({ code: "", discountType: "percentage", discountValue: "", expiryDate: "" });
        triggerFeedback("Promotional discount code activated!");
      } else {
        const errData = await res.json();
        triggerFeedback(errData.message || "Failed to create coupon", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCoupons(coupons.filter(c => c._id !== couponId));
        triggerFeedback("Coupon deactivated and deleted.");
      } else {
        triggerFeedback("Failed to delete coupon", "danger");
      }
    } catch (err) {
      triggerFeedback("Network connection error", "danger");
    }
  };

  // If role is loaded but not Admin, show blank page while redirect executes
  if (!user || !user.isAdmin) {
    return <div className="text-center py-5">Checking credentials, redirecting...</div>;
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container-fluid px-4">
        
        {/* Header Ribbon */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <h2 className="fw-extrabold text-dark mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill text-primary"></i> 
              Zonda Admin Panel
            </h2>
            <p className="text-muted small mb-0">Role: <span className="badge bg-primary">{user.adminRole}</span> | Account: {user.email}</p>
          </div>
          <button onClick={() => navigate("/profile")} className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            <i className="bi bi-person-fill"></i> View My Profile
          </button>
        </div>

        {/* Global Feedback Banner */}
        {actionFeedback.message && (
          <div className={`alert alert-${actionFeedback.type} border-0 shadow-sm mb-4`} role="alert">
            <i className={`bi ${actionFeedback.type === 'danger' ? 'bi-x-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>
            {actionFeedback.message}
          </div>
        )}

        <div className="row g-4">
          
          {/* Sidebar Navigation */}
          <div className="col-12 col-md-3 col-lg-2">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex flex-column gap-1.5 nav nav-pills">
                <button 
                  onClick={() => setActiveTab("overview")} 
                  className={`btn btn-sm text-start py-2.5 px-3 border-0 rounded-3 transition-all ${activeTab === "overview" ? "bg-primary text-white fw-bold" : "btn-light text-muted"}`}
                >
                  <i className="bi bi-grid-fill me-2"></i> Overview
                </button>
                <button 
                  onClick={() => setActiveTab("users")} 
                  className={`btn btn-sm text-start py-2.5 px-3 border-0 rounded-3 transition-all ${activeTab === "users" ? "bg-primary text-white fw-bold" : "btn-light text-muted"}`}
                >
                  <i className="bi bi-people-fill me-2"></i> Users List
                </button>
                <button 
                  onClick={() => setActiveTab("sellers")} 
                  className={`btn btn-sm text-start py-2.5 px-3 border-0 rounded-3 transition-all ${activeTab === "sellers" ? "bg-primary text-white fw-bold" : "btn-light text-muted"}`}
                >
                  <i className="bi bi-shop me-2"></i> Seller Onboarding
                </button>
                <button 
                  onClick={() => setActiveTab("products")} 
                  className={`btn btn-sm text-start py-2.5 px-3 border-0 rounded-3 transition-all ${activeTab === "products" ? "bg-primary text-white fw-bold" : "btn-light text-muted"}`}
                >
                  <i className="bi bi-box-seam-fill me-2"></i> Products Catalog
                </button>
                <button 
                  onClick={() => setActiveTab("categories")} 
                  className={`btn btn-sm text-start py-2.5 px-3 border-0 rounded-3 transition-all ${activeTab === "categories" ? "bg-primary text-white fw-bold" : "btn-light text-muted"}`}
                >
                  <i className="bi bi-tags-fill me-2"></i> Categories CRUD
                </button>
                <button 
                  onClick={() => setActiveTab("orders")} 
                  className={`btn btn-sm text-start py-2.5 px-3 border-0 rounded-3 transition-all ${activeTab === "orders" ? "bg-primary text-white fw-bold" : "btn-light text-muted"}`}
                >
                  <i className="bi bi-cart-fill me-2"></i> Orders Dispatch
                </button>
                <button 
                  onClick={() => setActiveTab("promotions")} 
                  className={`btn btn-sm text-start py-2.5 px-3 border-0 rounded-3 transition-all ${activeTab === "promotions" ? "bg-primary text-white fw-bold" : "btn-light text-muted"}`}
                >
                  <i className="bi bi-ticket-perforated-fill me-2"></i> Coupon Codes
                </button>
                <button 
                  onClick={() => setActiveTab("delivery")} 
                  className={`btn btn-sm text-start py-2.5 px-3 border-0 rounded-3 transition-all ${activeTab === "delivery" ? "bg-primary text-white fw-bold" : "btn-light text-muted"}`}
                >
                  <i className="bi bi-truck me-2"></i> Delivery Logistics
                </button>
                
                {user.adminRole === "Super Admin" && (
                  <button 
                    onClick={() => setActiveTab("logs")} 
                    className={`btn btn-sm text-start py-2.5 px-3 border-0 rounded-3 transition-all ${activeTab === "logs" ? "bg-primary text-white fw-bold" : "btn-light text-muted"}`}
                  >
                    <i className="bi bi-receipt-cutoff me-2"></i> Audit Logs
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="col-12 col-md-9 col-lg-10">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white min-vh-75">
              
              {loading ? (
                <div className="d-flex align-items-center justify-content-center py-5 min-vh-50">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading panel...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* OVERVIEW PANEL */}
                  {activeTab === "overview" && stats && (
                    <div>
                      <h4 className="fw-bold text-dark mb-4">Platform Stats Overview</h4>
                      <div className="row g-4 mb-5">
                        
                        <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                          <div className="card border-0 bg-primary bg-gradient text-white p-3 rounded-4 shadow-sm">
                            <h6 className="opacity-75 small">Total Users</h6>
                            <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
                            <div className="small opacity-50 mt-1">Buyers: {stats.totalBuyers} | Admins: {stats.totalAdmins}</div>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                          <div className="card border-0  text-dark p-3 rounded-4 shadow-sm">
                            <h6 className="opacity-75 small">Registered Merchants</h6>
                            <h3 className="fw-bold mb-0">{stats.totalSellers}</h3>
                            <div className="small text-danger fw-semibold mt-1">Pending approval: {stats.pendingSellers}</div>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                          <div className="card border-0 bg-success bg-gradient text-white p-3 rounded-4 shadow-sm">
                            <h6 className="opacity-75 small">Gross Merchandise Value</h6>
                            <h3 className="fw-bold mb-0">₹{stats.totalSales.toLocaleString("en-IN")}</h3>
                            <div className="small opacity-75 mt-1">Total orders: {stats.totalOrders}</div>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                          <div className="card border-0 bg-warning bg-gradient text-dark p-3 rounded-4 shadow-sm">
                            <h6 className="opacity-75 small">Estimated Commission (10%)</h6>
                            <h3 className="fw-bold mb-0">₹{stats.totalCommission.toLocaleString("en-IN")}</h3>
                            <div className="small opacity-50 mt-1">Zonda Platform Earnings</div>
                          </div>
                        </div>
                      </div>

                      {/* Mock Quick Actions info */}
                      <div className="p-4 bg-light rounded-4 border">
                        <h6 className="fw-bold text-dark mb-2">Administrator Instructions</h6>
                        <ul className="text-muted mb-0 small text-start">
                          <li>Use <strong>Users List</strong> to view registered buyer accounts and suspend offending accounts.</li>
                          <li>Go to <strong>Seller Onboarding</strong> to verify registration details, files, and bank forms to approve sellers.</li>
                          <li>Moderators and Managers can review products and change category properties dynamically.</li>
                          <li>Only accounts with <strong>Super Admin</strong> role can view systemic Audit Logs and alter administrator roles.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* USERS LIST PANEL */}
                  {activeTab === "users" && (
                    <div>
                      <h4 className="fw-bold text-dark mb-4">Platform Users Management</h4>
                      <div className="table-responsive">
                        <table className="table align-middle table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Account Type</th>
                              <th>Admin Role</th>
                              <th>Account Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((target) => (
                              <tr key={target._id}>
                                <td className="fw-semibold">{target.name}</td>
                                <td>{target.email}</td>
                                <td>
                                  {target.isAdmin ? (
                                    <span className="badge bg-dark">Admin</span>
                                  ) : target.isSeller ? (
                                    <span className="badge bg-info text-dark">Seller</span>
                                  ) : (
                                    <span className="badge bg-secondary">Buyer</span>
                                  )}
                                </td>
                                <td>
                                  {target.isAdmin ? (
                                    user.adminRole === "Super Admin" ? (
                                      <select 
                                        value={target.adminRole} 
                                        onChange={(e) => handleChangeRole(target, e.target.value)}
                                        className="form-select form-select-sm w-auto rounded-3 py-1"
                                      >
                                        <option value="Super Admin">Super Admin</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Moderator">Moderator</option>
                                        <option value="Support">Support</option>
                                      </select>
                                    ) : (
                                      <span className="badge bg-light text-dark border">{target.adminRole}</span>
                                    )
                                  ) : (
                                    <span className="text-muted small">-</span>
                                  )}
                                </td>
                                <td>
                                  {target.isSuspended ? (
                                    <span className="badge bg-danger">Suspended</span>
                                  ) : (
                                    <span className="badge bg-success">Active</span>
                                  )}
                                </td>
                                <td>
                                  {target._id !== user._id ? (
                                    <button 
                                      onClick={() => handleToggleSuspension(target)}
                                      className={`btn btn-xs fw-bold px-2.5 py-1 ${target.isSuspended ? "btn-success text-white" : "btn-outline-danger"}`}
                                      style={{ fontSize: "11px", borderRadius: "6px" }}
                                    >
                                      {target.isSuspended ? "Unsuspend" : "Suspend"}
                                    </button>
                                  ) : (
                                    <span className="text-muted small">You</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SELLER ONBOARDING PANEL */}
                  {activeTab === "sellers" && (
                    <div>
                      <h4 className="fw-bold text-dark mb-4">Merchant & Seller Onboarding</h4>
                      <div className="table-responsive">
                        <table className="table align-middle table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Business Details</th>
                              <th>Tax/GST ID</th>
                              <th>Verification</th>
                              <th>Bank Details</th>
                              <th>Current Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.filter(u => u.isSeller).map((seller) => (
                              <tr key={seller._id}>
                                <td>
                                  <div className="fw-bold">{seller.sellerDetails?.businessName || seller.name}</div>
                                  <div className="text-muted small">Contact: {seller.sellerDetails?.businessContact || seller.email}</div>
                                  <div className="text-muted small" style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    Addr: {seller.sellerDetails?.businessAddress || "N/A"}
                                  </div>
                                </td>
                                <td className="font-monospace small">{seller.sellerDetails?.taxId || "N/A"}</td>
                                <td>
                                  <div className="small">Doc: <span className="fw-semibold">{seller.sellerDetails?.idVerification?.docType || "N/A"}</span></div>
                                  <div className="text-muted small">No: {seller.sellerDetails?.idVerification?.docNumber || "N/A"}</div>
                                  {seller.sellerDetails?.idVerification?.docUrl && (
                                    <a href={seller.sellerDetails.idVerification.docUrl} target="_blank" rel="noreferrer" className="text-primary small text-decoration-none">
                                      View File <i className="bi bi-box-arrow-up-right"></i>
                                    </a>
                                  )}
                                </td>
                                <td>
                                  <div className="small fw-semibold">{seller.sellerDetails?.bankInfo?.bankName || "N/A"}</div>
                                  <div className="text-muted small">Acc: {seller.sellerDetails?.bankInfo?.accountNumber || "N/A"}</div>
                                  <div className="text-muted small">IFSC: {seller.sellerDetails?.bankInfo?.ifscCode || "N/A"}</div>
                                </td>
                                <td>
                                  <span className={`badge ${seller.sellerStatus === 'Approved' ? 'bg-success' : seller.sellerStatus === 'Suspended' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                    {seller.sellerStatus || "Pending"}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex flex-column gap-1">
                                    <button 
                                      onClick={() => handleUpdateSellerStatus(seller, "Approved")} 
                                      disabled={seller.sellerStatus === "Approved"}
                                      className="btn btn-success btn-sm text-white py-1 px-2 fw-semibold"
                                      style={{ fontSize: "11px", borderRadius: "6px" }}
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateSellerStatus(seller, "Suspended")} 
                                      disabled={seller.sellerStatus === "Suspended"}
                                      className="btn btn-danger btn-sm text-white py-1 px-2 fw-semibold"
                                      style={{ fontSize: "11px", borderRadius: "6px" }}
                                    >
                                      Suspend
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {users.filter(u => u.isSeller).length === 0 && (
                              <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">No merchants registered yet.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* PRODUCTS CATALOG PANEL */}
                  {activeTab === "products" && (
                    <div>
                      <h4 className="fw-bold text-dark mb-4">Products Moderation</h4>
                      
                      {/* Edit Product Inline Form Overlay */}
                      {editingProduct && (
                        <div className="p-4 bg-light rounded-4 border mb-4">
                          <h6 className="fw-bold text-dark mb-3">Edit Product ID: {editingProduct.id}</h6>
                          <form onSubmit={handleEditProductSubmit} className="row g-3">
                            <div className="col-12 col-md-6">
                              <label className="form-label small">Product Name</label>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={editingProduct.name} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} 
                              />
                            </div>
                            <div className="col-12 col-md-6">
                              <label className="form-label small">Category</label>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={editingProduct.category} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} 
                              />
                            </div>
                            <div className="col-12 col-md-4">
                              <label className="form-label small">Price (₹)</label>
                              <input 
                                type="number" 
                                className="form-control form-control-sm" 
                                value={editingProduct.price} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} 
                              />
                            </div>
                            <div className="col-12 col-md-4">
                              <label className="form-label small">Original Price Strike (e.g. ₹1,999)</label>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={editingProduct.originalPrice} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })} 
                              />
                            </div>
                            <div className="col-12 col-md-4">
                              <label className="form-label small">Inventory Stock</label>
                              <input 
                                type="number" 
                                className="form-control form-control-sm" 
                                value={editingProduct.stock} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} 
                              />
                            </div>
                            <div className="col-12 col-md-6">
                              <label className="form-label small">Promo Badge (e.g., Best Seller, 50% OFF)</label>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={editingProduct.badge} 
                                onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })} 
                              />
                            </div>
                            <div className="col-12 text-end">
                              <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary btn-sm me-2 rounded-3">Cancel</button>
                              <button type="submit" className="btn btn-primary btn-sm rounded-3">Save Changes</button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="table-responsive">
                        <table className="table align-middle table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Product</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Stock</th>
                              <th>Seller</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((prod) => (
                              <tr key={prod.id}>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <img 
                                      src={prod.src?.startsWith("http") ? prod.src : `/${prod.src}`} 
                                      alt="" 
                                      style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f8fafc" }} 
                                    />
                                    <div>
                                      <div className="fw-semibold text-start">{prod.name}</div>
                                      {prod.badge && <span className="badge bg-danger-subtle text-danger font-monospace px-2 py-0.5" style={{ fontSize: "10px" }}>{prod.badge}</span>}
                                    </div>
                                  </div>
                                </td>
                                <td><span className="badge bg-light text-dark border">{prod.category}</span></td>
                                <td>
                                  <div className="fw-bold">₹{prod.price.toLocaleString("en-IN")}</div>
                                  {prod.originalPrice && <div className="text-muted text-decoration-line-through small">{prod.originalPrice}</div>}
                                </td>
                                <td>{prod.stock || 0} items</td>
                                <td>
                                  {prod.sellerId ? (
                                    <div>
                                      <div className="small fw-semibold">{prod.sellerId.name}</div>
                                      <div className="text-muted small">{prod.sellerId.email}</div>
                                    </div>
                                  ) : (
                                    <span className="badge bg-secondary-subtle text-muted">Admin / Global</span>
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <button 
                                      onClick={() => setEditingProduct(prod)} 
                                      className="btn btn-outline-secondary btn-sm"
                                      style={{ borderRadius: "6px" }}
                                    >
                                      <i className="bi bi-pencil-fill"></i>
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteProduct(prod.id)} 
                                      className="btn btn-outline-danger btn-sm"
                                      style={{ borderRadius: "6px" }}
                                    >
                                      <i className="bi bi-trash3-fill"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* CATEGORIES MANAGEMENT PANEL */}
                  {activeTab === "categories" && (
                    <div>
                      <h4 className="fw-bold text-dark mb-4">Categories & Subcategories</h4>
                      
                      {/* Add Category Form */}
                      <form onSubmit={handleAddCategory} className="row g-3 p-4 bg-light rounded-4 border mb-4">
                        <h6 className="fw-bold text-dark mb-1">Create New Category</h6>
                        <div className="col-12 col-md-5 text-start">
                          <label className="form-label small">Category Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Audio & Headphones" 
                            className="form-control form-control-sm rounded-3" 
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          />
                        </div>
                        <div className="col-12 col-md-5 text-start">
                          <label className="form-label small">Subcategories (comma separated)</label>
                          <input 
                            type="text" 
                            placeholder="e.g., Earbuds, Soundbars, Speakers" 
                            className="form-control form-control-sm rounded-3" 
                            value={newCategory.subcategories}
                            onChange={(e) => setNewCategory({ ...newCategory, subcategories: e.target.value })}
                          />
                        </div>
                        <div className="col-12 col-md-2 d-flex align-items-end">
                          <button type="submit" className="btn btn-primary btn-sm w-100 py-2 rounded-3 fw-bold">
                            Create
                          </button>
                        </div>
                      </form>

                      {/* Categories Table */}
                      <div className="table-responsive">
                        <table className="table align-middle table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Category</th>
                              <th>URL Slug</th>
                              <th>Subcategories</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((cat) => (
                              <tr key={cat._id}>
                                <td className="fw-bold text-start">{cat.name}</td>
                                <td className="font-monospace small">{cat.slug}</td>
                                <td className="text-start">
                                  {cat.subcategories?.map((s, idx) => (
                                    <span key={idx} className="badge bg-light text-primary border me-1 small">{s}</span>
                                  )) || <span className="text-muted small">None</span>}
                                </td>
                                <td>
                                  <button 
                                    onClick={() => handleDeleteCategory(cat._id)} 
                                    className="btn btn-outline-danger btn-sm rounded-3"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {categories.length === 0 && (
                              <tr>
                                <td colSpan="4" className="text-center py-4 text-muted">No dynamic categories configured. Fallback defaults are rendering on products views.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ORDERS DISPATCH PANEL */}
                  {activeTab === "orders" && (
                    <div>
                      <h4 className="fw-bold text-dark mb-4">Orders Dispatch Management</h4>
                      <div className="table-responsive">
                        <table className="table align-middle table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Order ID</th>
                              <th>Customer</th>
                              <th>Order Date</th>
                              <th>Amount</th>
                              <th>Order Status</th>
                              <th>Action Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order._id}>
                                <td className="font-monospace small fw-bold">#{order._id.substring(18)}</td>
                                <td className="text-start">
                                  <div className="fw-semibold">{order.shippingAddress?.fullName || "Guest User"}</div>
                                  <div className="text-muted small">{order.userId?.email || "Unknown"}</div>
                                </td>
                                <td className="small">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="fw-bold">₹{Number(order.totalAmount).toLocaleString("en-IN")}</td>
                                <td>
                                  <span className={`badge ${order.orderStatus === 'Delivered' ? 'bg-success' : order.orderStatus === 'Shipped' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                    {order.orderStatus || "Pending"}
                                  </span>
                                </td>
                                <td>
                                  <select 
                                    value={order.orderStatus}
                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                    className="form-select form-select-sm w-auto rounded-3 py-1 font-monospace"
                                    style={{ fontSize: "12px" }}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                            {orders.length === 0 && (
                              <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">No customer orders recorded in system.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* PROMOTIONS / COUPONS PANEL */}
                  {activeTab === "promotions" && (
                    <div>
                      <h4 className="fw-bold text-dark mb-4">Promotional Campaigns & Coupons</h4>
                      
                      {/* Add Coupon Form */}
                      <form onSubmit={handleAddCoupon} className="row g-3 p-4 bg-light rounded-4 border mb-4">
                        <h6 className="fw-bold text-dark mb-1">Create Promotional Code</h6>
                        <div className="col-12 col-md-3 text-start">
                          <label className="form-label small">Promo Code</label>
                          <input 
                            type="text" 
                            placeholder="e.g. SAVE20" 
                            className="form-control form-control-sm rounded-3 font-monospace text-uppercase" 
                            value={newCoupon.code}
                            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                          />
                        </div>
                        <div className="col-12 col-md-3 text-start">
                          <label className="form-label small">Type</label>
                          <select 
                            className="form-select form-select-sm rounded-3" 
                            value={newCoupon.discountType}
                            onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Cash (₹)</option>
                          </select>
                        </div>
                        <div className="col-12 col-md-3 text-start">
                          <label className="form-label small">Value</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 20" 
                            className="form-control form-control-sm rounded-3" 
                            value={newCoupon.discountValue}
                            onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                          />
                        </div>
                        <div className="col-12 col-md-3 text-start">
                          <label className="form-label small">Expiry Date</label>
                          <input 
                            type="date" 
                            className="form-control form-control-sm rounded-3" 
                            value={newCoupon.expiryDate}
                            onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                          />
                        </div>
                        <div className="col-12 text-end mt-3">
                          <button type="submit" className="btn btn-primary btn-sm px-4 py-2 rounded-3 fw-bold">
                            Activate Promo Code
                          </button>
                        </div>
                      </form>

                      {/* Coupons Table */}
                      <div className="table-responsive">
                        <table className="table align-middle table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Promo Code</th>
                              <th>Discount</th>
                              <th>Expiry Date</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coupons.map((coupon) => (
                              <tr key={coupon._id}>
                                <td className="font-monospace fw-bold text-primary">{coupon.code}</td>
                                <td>
                                  {coupon.discountType === "percentage" ? (
                                    <span>{coupon.discountValue}% Off</span>
                                  ) : (
                                    <span>₹{coupon.discountValue} Off</span>
                                  )}
                                </td>
                                <td className="small">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                <td>
                                  {new Date(coupon.expiryDate) > new Date() ? (
                                    <span className="badge bg-success">Active</span>
                                  ) : (
                                    <span className="badge bg-secondary">Expired</span>
                                  )}
                                </td>
                                <td>
                                  <button 
                                    onClick={() => handleDeleteCoupon(coupon._id)} 
                                    className="btn btn-outline-danger btn-sm rounded-3"
                                  >
                                    Deactivate
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {coupons.length === 0 && (
                              <tr>
                                <td colSpan="5" className="text-center py-4 text-muted">No promotional coupons configured yet.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* AUDIT LOGS PANEL */}
                  {activeTab === "logs" && user.adminRole === "Super Admin" && (
                    <div>
                      <h4 className="fw-bold text-dark mb-4">Activity Audit Trails</h4>
                      <div className="table-responsive">
                        <table className="table align-middle table-sm font-monospace text-start" style={{ fontSize: "12px" }}>
                          <thead className="table-light">
                            <tr>
                              <th>Timestamp</th>
                              <th>Admin Account</th>
                              <th>Operation</th>
                              <th>Description Details</th>
                              <th>IP Source</th>
                            </tr>
                          </thead>
                          <tbody>
                            {logs.map((log) => (
                              <tr key={log._id}>
                                <td>{new Date(log.createdAt).toLocaleString()}</td>
                                <td><span className="fw-bold">{log.adminName}</span></td>
                                <td><span className="badge bg-dark">{log.action}</span></td>
                                <td>{log.details}</td>
                                <td className="text-muted small">{log.ipAddress || "Unknown"}</td>
                              </tr>
                            ))}
                            {logs.length === 0 && (
                              <tr>
                                <td colSpan="5" className="text-center py-4 text-muted">No administrative logs recorded in system.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* DELIVERY LOGISTICS PANEL */}
                  {activeTab === "delivery" && (
                    <div>
                      <h4 className="fw-bold text-dark mb-4">Delivery & Fleet Logistics Control</h4>

                      {/* STATS ANALYTICS CARD OVERVIEW */}
                      <div className="row g-3 mb-4">
                        <div className="col-12 col-md-4">
                          <div className="card bg-light border-0 p-3 rounded-3">
                            <div className="text-muted small fw-semibold">Total Delivery Partners</div>
                            <div className="fs-3 fw-bold text-dark">
                              {users.filter(u => u.isDeliveryPartner).length}
                            </div>
                            <div className="small text-success mt-1">
                              {users.filter(u => u.isDeliveryPartner && u.deliveryPartnerStatus === "Approved").length} Verified & Active
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="card bg-light border-0 p-3 rounded-3">
                            <div className="text-muted small fw-semibold">Pending Approvals</div>
                            <div className="fs-3 fw-bold text-warning">
                              {users.filter(u => u.isDeliveryPartner && u.deliveryPartnerStatus === "Pending").length} Applications
                            </div>
                            <div className="small text-muted mt-1">Require document review</div>
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="card bg-light border-0 p-3 rounded-3">
                            <div className="text-muted small fw-semibold">Delivery Shipments Status</div>
                            <div className="small text-muted mt-1">
                              • Unassigned: <strong className="text-dark">{orders.filter(o => o.deliveryStatus === "Unassigned").length}</strong><br/>
                              • In Transit: <strong className="text-dark">{orders.filter(o => ["Accepted", "Picked Up", "Out for Delivery"].includes(o.deliveryStatus)).length}</strong><br/>
                              • Completed: <strong className="text-success">{orders.filter(o => o.deliveryStatus === "Delivered").length}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SUB SECTION 1: DELIVERY PARTNERS APPLICATIONS */}
                      <div className="card border p-3 rounded-4 mb-4">
                        <h6 className="fw-bold mb-3"><i className="bi bi-people-fill text-primary me-2"></i>Delivery Fleet Registration & Approvals</h6>
                        <div className="table-responsive">
                          <table className="table align-middle table-hover text-start small">
                            <thead className="table-light">
                              <tr>
                                <th>Name / Email</th>
                                <th>Vehicle Details</th>
                                <th>License & ID Documents</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.filter(u => u.isDeliveryPartner).map((partner) => (
                                <tr key={partner._id}>
                                  <td>
                                    <div className="fw-bold">{partner.name}</div>
                                    <div className="text-muted font-monospace" style={{ fontSize: "11px" }}>{partner.email}</div>
                                  </td>
                                  <td>
                                    <span className="badge bg-secondary me-1 text-uppercase">{partner.deliveryPartnerDetails?.vehicleType}</span>
                                    <div className="small text-muted font-monospace">{partner.deliveryPartnerDetails?.vehicleNumber}</div>
                                  </td>
                                  <td>
                                    <div>License: <span className="font-monospace text-dark">{partner.deliveryPartnerDetails?.licenseNumber}</span></div>
                                    <div className="small text-muted">{partner.deliveryPartnerDetails?.idDocuments?.docType}: {partner.deliveryPartnerDetails?.idDocuments?.docNumber}</div>
                                  </td>
                                  <td>
                                    <span className={`badge rounded-pill ${
                                      partner.deliveryPartnerStatus === "Approved" ? "bg-success" :
                                      partner.deliveryPartnerStatus === "Suspended" ? "bg-danger" : "bg-warning text-dark"
                                    }`}>{partner.deliveryPartnerStatus || "Pending"}</span>
                                  </td>
                                  <td>
                                    <div className="d-flex gap-1">
                                      {partner.deliveryPartnerStatus !== "Approved" && (
                                        <button 
                                          onClick={() => handleUpdateDeliveryPartnerStatus(partner, "Approved")}
                                          className="btn btn-success btn-xs px-2.5 py-1 fw-bold rounded-pill"
                                          style={{ fontSize: "11px" }}
                                        >
                                          Approve
                                        </button>
                                      )}
                                      {partner.deliveryPartnerStatus === "Approved" && (
                                        <button 
                                          onClick={() => handleUpdateDeliveryPartnerStatus(partner, "Suspended")}
                                          className="btn btn-outline-danger btn-xs px-2.5 py-1 fw-semibold rounded-pill"
                                          style={{ fontSize: "11px" }}
                                        >
                                          Suspend
                                        </button>
                                      )}
                                      {partner.deliveryPartnerStatus === "Suspended" && (
                                        <button 
                                          onClick={() => handleUpdateDeliveryPartnerStatus(partner, "Approved")}
                                          className="btn btn-outline-success btn-xs px-2.5 py-1 fw-semibold rounded-pill"
                                          style={{ fontSize: "11px" }}
                                        >
                                          Activate
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {users.filter(u => u.isDeliveryPartner).length === 0 && (
                                <tr>
                                  <td colSpan="5" className="text-center py-3 text-muted">No delivery partner applications logged.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* SUB SECTION 2: DISPATCH & ORDER ASSIGNMENT */}
                      <div className="card border p-3 rounded-4">
                        <h6 className="fw-bold mb-3"><i className="bi bi-cart-check-fill text-success me-2"></i>Active Orders Dispatch & Driver Allocations</h6>
                        <div className="table-responsive">
                          <table className="table align-middle table-hover text-start small">
                            <thead className="table-light">
                              <tr>
                                <th>Order ID</th>
                                <th>Customer & Destination</th>
                                <th>Pricing</th>
                                <th>Delivery Status</th>
                                <th>Allocated Courier</th>
                                <th>Assign Partner Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order) => {
                                // Find currently selected option for manual override dropdown
                                const availablePartners = users.filter(u => u.isDeliveryPartner && u.deliveryPartnerStatus === "Approved");
                                
                                return (
                                  <tr key={order._id}>
                                    <td className="font-monospace fw-semibold">#{order._id.substring(18)}</td>
                                    <td>
                                      <div className="fw-bold">{order.shippingAddress?.fullName}</div>
                                      <div className="small text-muted">{order.shippingAddress?.city}, Pin {order.shippingAddress?.postalCode}</div>
                                    </td>
                                    <td className="fw-bold text-dark">₹{order.pricing?.totalAmount}</td>
                                    <td>
                                      <span className={`badge ${
                                        order.deliveryStatus === "Delivered" ? "bg-success" :
                                        order.deliveryStatus === "Unassigned" ? "bg-secondary" : "bg-info text-dark"
                                      }`}>{order.deliveryStatus}</span>
                                    </td>
                                    <td>
                                      {order.deliveryPartnerId ? (
                                        <div>
                                          <div className="fw-semibold text-primary">
                                            {/* Look up partner name in users state */}
                                            {users.find(u => u._id === order.deliveryPartnerId)?.name || "Assigned Driver"}
                                          </div>
                                          <div className="small text-muted font-monospace" style={{ fontSize: "10px" }}>ID: {order.deliveryPartnerId.substring(18)}</div>
                                        </div>
                                      ) : (
                                        <span className="text-muted italic small">No Courier Allocated</span>
                                      )}
                                    </td>
                                    <td>
                                      {order.deliveryStatus !== "Delivered" && (
                                        <div className="d-flex flex-column gap-1.5" style={{ maxWidth: "200px" }}>
                                          
                                          {/* Dropdown containing approved partners */}
                                          <select 
                                            id={`select-partner-${order._id}`}
                                            className="form-select form-select-xs"
                                            style={{ fontSize: "11px", padding: "3px 6px" }}
                                            defaultValue=""
                                          >
                                            <option value="" disabled>Select Driver...</option>
                                            {availablePartners.map(p => (
                                              <option key={p._id} value={p._id}>{p.name} ({p.deliveryPartnerDetails?.vehicleType})</option>
                                            ))}
                                          </select>

                                          <div className="d-flex gap-1">
                                            <button 
                                              onClick={() => {
                                                const select = document.getElementById(`select-partner-${order._id}`);
                                                handleManualAssignment(order._id, select?.value);
                                              }}
                                              className="btn btn-dark btn-xs w-50 py-1"
                                              style={{ fontSize: "10px" }}
                                            >
                                              Assign Manual
                                            </button>
                                            
                                            <button 
                                              onClick={() => handleAutoAssignment(order._id)}
                                              className="btn btn-outline-primary btn-xs w-50 py-1"
                                              style={{ fontSize: "10px" }}
                                            >
                                              Auto-Assign
                                            </button>
                                          </div>

                                        </div>
                                      )}
                                      {order.deliveryStatus === "Delivered" && (
                                        <span className="text-success small fw-semibold"><i className="bi bi-check2-all me-1"></i>Completed Shipment</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                              {orders.length === 0 && (
                                <tr>
                                  <td colSpan="6" className="text-center py-3 text-muted">No orders available in systems registry.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
