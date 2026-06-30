import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DeliveryDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("requests");
  const [profileData, setProfileData] = useState(null);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const API_URL = "http://localhost:5000/api/delivery";

  // Security check: Redirect if not logged in or not a delivery partner
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.isDeliveryPartner) {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setErrorMsg("");
    try {
      // Fetch Profile & Earnings
      const profileRes = await fetch(`${API_URL}/earnings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileJson = await profileRes.json();

      if (profileRes.ok) {
        setProfileData(profileJson);
      } else {
        setErrorMsg(profileJson.message || "Failed to fetch profile metrics");
      }

      // Fetch Available Requests
      const requestsRes = await fetch(`${API_URL}/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const requestsJson = await requestsRes.json();
      if (requestsRes.ok) {
        setAvailableRequests(requestsJson);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error loading dashboard details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAcceptOrder = async (orderId) => {
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (res.ok) {
        setMessage("Delivery request accepted successfully!");
        fetchData();
        setActiveTab("active");
      } else {
        setErrorMsg(json.message || "Error accepting order request.");
      }
    } catch (err) {
      setErrorMsg("Failed to accept request.");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, remarks = "") => {
    setMessage("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, remarks })
      });
      const json = await res.json();
      if (res.ok) {
        setMessage(`Status updated to "${newStatus}"!`);
        fetchData();
      } else {
        setErrorMsg(json.message || "Failed to update delivery milestone.");
      }
    } catch (err) {
      setErrorMsg("Error communicating with servers.");
    }
  };

  if (!user || !user.isDeliveryPartner) {
    return null;
  }

  // Filter Active orders vs Available requests
  const activeOrders = availableRequests.filter(
    (o) => o.deliveryPartnerId && o.deliveryPartnerId.toString() === user._id && o.deliveryStatus !== "Delivered" && o.deliveryStatus !== "Failed" && o.deliveryStatus !== "Returned"
  );

  const pendingRequests = availableRequests.filter(
    (o) => o.deliveryStatus === "Unassigned" || (o.deliveryPartnerId && o.deliveryPartnerId.toString() === user._id && o.deliveryStatus === "Assigned")
  );

  return (
    <div className="container-fluid py-5 bg-light" style={{ minHeight: "92vh" }}>
      <div className="container">
        
        {/* Header Branding Row */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3 border-bottom pb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Delivery Partner Workspace</h2>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-dark rounded-pill">Partner Account</span>
              {profileData && (
                <span className={`badge rounded-pill ${
                  profileData.status === "Approved" ? "bg-success" : 
                  profileData.status === "Suspended" ? "bg-danger" : "bg-warning text-dark"
                }`}>
                  Approval Status: {profileData.status || "Pending"}
                </span>
              )}
            </div>
          </div>
          <div className="d-flex gap-2">
            <button onClick={fetchData} className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
            <button onClick={logout} className="btn btn-danger d-flex align-items-center gap-2">
              <i className="bi bi-box-arrow-right"></i> Log Out
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {message && (
          <div className="alert alert-success border-0 rounded-3 p-3 mb-4 d-flex align-items-center gap-2 shadow-sm">
            <i className="bi bi-check-circle-fill"></i>
            <div className="fw-semibold small">{message}</div>
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-danger border-0 rounded-3 p-3 mb-4 d-flex align-items-center gap-2 shadow-sm">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <div className="fw-semibold small">{errorMsg}</div>
          </div>
        )}

        {/* Status Check if Pending/Suspended */}
        {profileData && profileData.status !== "Approved" ? (
          <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-4">
            <div className="text-warning display-4 mb-3"><i className="bi bi-shield-exclamation"></i></div>
            <h4 className="fw-bold text-dark">Profile Verification in Progress</h4>
            <p className="text-muted mx-auto" style={{ maxWidth: "480px" }}>
              Your delivery account is currently set to <strong>{profileData.status}</strong>. 
              Our administrative staff is verifying your driver license and documents. 
              You will be able to accept shipments as soon as verification is finalized.
            </p>
          </div>
        ) : (
          <>
            {/* Wallet Earnings Grid Cards */}
            {profileData && (
              <div className="row g-4 mb-5">
                <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                  <div className="card border-0 bg-dark text-white p-3.5 rounded-4 shadow-sm h-100">
                    <h6 className="opacity-75 small mb-1">Today's Commission</h6>
                    <h3 className="fw-bold mb-0">₹{profileData.details?.earnings?.daily || 0}</h3>
                    <div className="small opacity-50 mt-1.5">Direct payout per order: ₹60</div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                  <div className="card border-0 bg-primary bg-gradient text-white p-3.5 rounded-4 shadow-sm h-100">
                    <h6 className="opacity-75 small mb-1">Weekly Commissions</h6>
                    <h3 className="fw-bold mb-0">₹{profileData.details?.earnings?.weekly || 0}</h3>
                    <div className="small opacity-50 mt-1.5">Weekly cutoff reset on Sundays</div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                  <div className="card border-0 bg-success bg-gradient text-white p-3.5 rounded-4 shadow-sm h-100">
                    <h6 className="opacity-75 small mb-1">Monthly Earnings</h6>
                    <h3 className="fw-bold mb-0">₹{profileData.details?.earnings?.monthly || 0}</h3>
                    <div className="small opacity-50 mt-1.5">Accumulated payout ledger</div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-xl-3">
                  <div className="card border-0 bg-white text-dark p-3.5 rounded-4 shadow-sm h-100">
                    <h6 className="opacity-75 small text-muted mb-1">Completed Deliveries</h6>
                    <h3 className="fw-bold mb-0">{profileData.completedDeliveries || 0}</h3>
                    <div className="small text-muted mt-1.5">Active Dispatches: {profileData.pendingDeliveries || 0}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Workspace Navigation Tabs */}
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
              <ul className="nav nav-tabs border-0 mb-4 d-flex gap-2">
                <li className="nav-item">
                  <button 
                    onClick={() => setActiveTab("requests")} 
                    className={`btn rounded-pill px-4 py-2 fw-semibold ${activeTab === "requests" ? "btn-dark" : "btn-light text-secondary"}`}
                  >
                    Available Jobs ({pendingRequests.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={() => setActiveTab("active")} 
                    className={`btn rounded-pill px-4 py-2 fw-semibold ${activeTab === "active" ? "btn-dark" : "btn-light text-secondary"}`}
                  >
                    Active Dispatches ({activeOrders.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={() => setActiveTab("history")} 
                    className={`btn rounded-pill px-4 py-2 fw-semibold ${activeTab === "history" ? "btn-dark" : "btn-light text-secondary"}`}
                  >
                    Completed Runs ({profileData?.history?.length || 0})
                  </button>
                </li>
              </ul>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-dark mb-2" role="status"></div>
                  <div className="small text-muted">Refreshing orders data...</div>
                </div>
              ) : (
                <div>
                  
                  {/* Requests Tab */}
                  {activeTab === "requests" && (
                    <div>
                      {pendingRequests.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <i className="bi bi-clipboard2-check display-5 mb-2"></i>
                          <h5>No Available Delivery Requests</h5>
                          <p className="small">Check back later or refresh when new orders are placed.</p>
                        </div>
                      ) : (
                        <div className="row g-4">
                          {pendingRequests.map((order) => (
                            <div className="col-12 col-md-6" key={order._id}>
                              <div className="card border-1 rounded-4 p-3 bg-light shadow-none">
                                <div className="d-flex justify-content-between mb-3">
                                  <span className="small fw-semibold text-muted">Order ID: #{order._id.substring(18)}</span>
                                  <span className="badge bg-warning text-dark">{order.paymentDetails?.paymentMethod}</span>
                                </div>
                                <h6 className="fw-bold mb-2">Pickup Details:</h6>
                                <p className="small text-muted mb-3">
                                  <i className="bi bi-shop me-1.5 text-warning"></i> Zonda Marketplace Logistics Hub
                                </p>
                                <h6 className="fw-bold mb-2">Dropoff Address:</h6>
                                <p className="small text-muted mb-3">
                                  <i className="bi bi-geo-alt-fill me-1.5 text-danger"></i>
                                  {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                </p>
                                <div className="border-top pt-3 d-flex align-items-center justify-content-between">
                                  <div>
                                    <div className="small text-muted">Payout Fee</div>
                                    <div className="fw-bold text-success">₹60.00</div>
                                  </div>
                                  <button 
                                    onClick={() => handleAcceptOrder(order._id)}
                                    className="btn btn-dark btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5 fw-semibold"
                                  >
                                    Accept Dispatch <i className="bi bi-arrow-right"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Active Shipments Tab */}
                  {activeTab === "active" && (
                    <div>
                      {activeOrders.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <i className="bi bi-box-seam display-5 mb-2"></i>
                          <h5>No Active Shipments</h5>
                          <p className="small">Accept order runs in the available jobs listing to begin deliveries.</p>
                        </div>
                      ) : (
                        <div className="row g-4">
                          {activeOrders.map((order) => (
                            <div className="col-12" key={order._id}>
                              <div className="card border-1 rounded-4 p-4 bg-light shadow-none">
                                <div className="row g-4">
                                  <div className="col-12 col-md-8">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                      <span className="badge bg-primary text-light px-2.5 py-1">Delivery State: {order.deliveryStatus}</span>
                                      <span className="small text-muted">Order ID: #{order._id}</span>
                                    </div>
                                    
                                    <div className="row mb-3">
                                      <div className="col-6">
                                        <div className="small text-muted fw-semibold mb-1">Customer Contact</div>
                                        <div className="fw-semibold text-dark">{order.shippingAddress?.fullName}</div>
                                        <div className="small text-muted">{order.shippingAddress?.phone}</div>
                                      </div>
                                      <div className="col-6">
                                        <div className="small text-muted fw-semibold mb-1">Payment Method</div>
                                        <div className="fw-semibold text-dark">{order.paymentDetails?.paymentMethod}</div>
                                        <div className="small text-success fw-bold">Amount: ₹{order.pricing?.totalAmount}</div>
                                      </div>
                                    </div>

                                    <div className="mb-3">
                                      <div className="small text-muted fw-semibold mb-1">Destination Location</div>
                                      <div className="small text-dark">
                                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                        {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-4 d-flex flex-column justify-content-center border-start-md ps-md-4 gap-2">
                                    <div className="fw-bold small text-muted text-center text-md-start mb-2">Update Delivery Steps:</div>

                                    {order.deliveryStatus === "Accepted" && (
                                      <button 
                                        onClick={() => handleUpdateStatus(order._id, "Picked Up")}
                                        className="btn btn-primary w-100 fw-bold rounded-pill"
                                      >
                                        Mark as Picked Up
                                      </button>
                                    )}

                                    {order.deliveryStatus === "Picked Up" && (
                                      <button 
                                        onClick={() => handleUpdateStatus(order._id, "Out for Delivery")}
                                        className="btn btn-warning w-100 fw-bold text-dark rounded-pill"
                                      >
                                        Mark Out for Delivery
                                      </button>
                                    )}

                                    {order.deliveryStatus === "Out for Delivery" && (
                                      <div className="d-flex flex-column gap-2">
                                        <button 
                                          onClick={() => handleUpdateStatus(order._id, "Delivered")}
                                          className="btn btn-success w-100 fw-bold rounded-pill"
                                        >
                                          Mark as Delivered (Completed)
                                        </button>
                                        <button 
                                          onClick={() => handleUpdateStatus(order._id, "Failed", "Customer door locked / Contact unreachable")}
                                          className="btn btn-outline-danger w-100 fw-bold rounded-pill"
                                        >
                                          Mark Delivery Failed
                                        </button>
                                      </div>
                                    )}

                                    {order.deliveryStatus === "Failed" && (
                                      <button 
                                        onClick={() => handleUpdateStatus(order._id, "Returned", "Items returned to hub storage")}
                                        className="btn btn-danger w-100 fw-bold rounded-pill"
                                      >
                                        Return Package to Seller Hub
                                      </button>
                                    )}

                                    <button 
                                      onClick={() => navigate(`/orders/track/${order._id}`)}
                                      className="btn btn-outline-dark btn-sm w-100 mt-2 rounded-pill fw-semibold"
                                    >
                                      Launch Tracking View <i className="bi bi-map"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* History Tab */}
                  {activeTab === "history" && (
                    <div>
                      {!profileData || !profileData.history || profileData.history.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <i className="bi bi-clock-history display-5 mb-2"></i>
                          <h5>No Finished Deliveries Yet</h5>
                          <p className="small">Your finished delivery dispatch histories will compile here.</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table align-middle">
                            <thead>
                              <tr>
                                <th>Order ID</th>
                                <th>Client Address</th>
                                <th>Payout</th>
                                <th>Status</th>
                                <th>Date Delivered</th>
                                <th>Rating</th>
                              </tr>
                            </thead>
                            <tbody>
                              {profileData.history.map((h) => (
                                <tr key={h._id}>
                                  <td className="small text-muted font-monospace">#{h._id.substring(14)}</td>
                                  <td className="small text-dark">
                                    {h.shippingAddress?.fullName}, {h.shippingAddress?.city}
                                  </td>
                                  <td className="fw-semibold text-success">₹60.00</td>
                                  <td>
                                    <span className={`badge rounded-pill ${
                                      h.deliveryStatus === "Delivered" ? "bg-success" : "bg-danger"
                                    }`}>{h.deliveryStatus}</span>
                                  </td>
                                  <td className="small text-muted">{new Date(h.updatedAt).toLocaleDateString()}</td>
                                  <td>
                                    {h.deliveryRating ? (
                                      <div className="text-warning">
                                        <i className="bi bi-star-fill me-1"></i>{h.deliveryRating}/5
                                      </div>
                                    ) : (
                                      <span className="small text-muted">Unrated</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default DeliveryDashboard;
