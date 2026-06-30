import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function CustomerTrackDelivery() {
  const { orderId } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");

  const fetchOrder = async () => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
      } else {
        setErrorMsg(data.message || "Failed to load tracking data");
      }
    } catch (err) {
      setErrorMsg("Network error fetching shipment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll updates every 6 seconds to show simulated location movement in real-time
    const interval = setInterval(fetchOrder, 6000);
    return () => clearInterval(interval);
  }, [orderId, token]);

  const handleRateDelivery = async (e) => {
    e.preventDefault();
    setRatingLoading(true);
    setRatingSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/delivery-rating`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, feedback })
      });
      const data = await res.json();
      if (res.ok) {
        setRatingSuccess("Thank you! Your feedback has been recorded.");
        setOrder(data.order);
      } else {
        setErrorMsg(data.message || "Error submitting rating");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to servers.");
    } finally {
      setRatingLoading(false);
    }
  };

  const handleReportIssue = (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReportSuccess("Your report has been logged. Support team will contact you shortly.");
    setReportText("");
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary my-4" role="status"></div>
        <h5>Connecting to Live Satellites...</h5>
      </div>
    );
  }

  if (errorMsg && !order) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "80vh" }}>
        <div className="alert alert-danger mx-auto" style={{ maxWidth: "500px" }}>{errorMsg}</div>
        <Link to="/orders" className="btn btn-dark mt-3 rounded-pill">Back to Orders</Link>
      </div>
    );
  }

  const deliveryStatus = order?.deliveryStatus || "Unassigned";

  // Determine SVG coordinates for mock driver vehicle location
  let progressPct = 0;
  if (deliveryStatus === "Accepted") progressPct = 15;
  else if (deliveryStatus === "Picked Up") progressPct = 40;
  else if (deliveryStatus === "Out for Delivery") progressPct = 75;
  else if (deliveryStatus === "Delivered") progressPct = 100;

  // Milestone checkmarks
  const milestones = [
    { label: "Order Placed", key: "Unassigned", desc: "Order details received by fulfillment hub." },
    { label: "Agent Allocated", key: "Assigned", desc: "Delivery partner assigned to shipment." },
    { label: "Dispatch Accepted", key: "Accepted", desc: "Courier partner heading to merchant store." },
    { label: "Picked Up", key: "Picked Up", desc: "Shipment packaged and left merchant facilities." },
    { label: "Out for Delivery", key: "Out for Delivery", desc: "Delivery agent is arriving at your location." },
    { label: "Completed", key: "Delivered", desc: "Order delivered safely." }
  ];

  const currentIdx = milestones.findIndex((m) => m.key === deliveryStatus);

  return (
    <div className="container-fluid py-5 bg-light" style={{ minHeight: "90vh" }}>
      <div className="container">
        
        {/* Breadcrumbs header */}
        <div className="mb-4">
          <Link to="/orders" className="text-decoration-none text-muted small">
            <i className="bi bi-chevron-left me-1"></i> Back to Orders
          </Link>
          <h2 className="fw-bold text-dark mt-2">Live Delivery Tracker</h2>
          <p className="text-muted small">Order ID: #{order._id} | Est. Delivery Time: <strong className="text-dark">{order.deliveryEta || "Calculating..."}</strong></p>
        </div>

        <div className="row g-4">
          
          {/* Tracking milestones column */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-4">Delivery Milestones</h5>

              <div className="position-relative ps-4" style={{ borderLeft: "2px solid #e2e8f0" }}>
                
                {milestones.map((m, idx) => {
                  const isDone = idx <= currentIdx || (deliveryStatus === "Delivered" && idx === milestones.length - 1);
                  const isCurrent = m.key === deliveryStatus || (deliveryStatus === "Unassigned" && idx === 0);

                  return (
                    <div className="position-relative mb-4" key={m.label}>
                      {/* Check dot */}
                      <span 
                        className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          left: "-33px",
                          top: "2px",
                          width: "16px",
                          height: "16px",
                          backgroundColor: isDone ? "#10b981" : "#cbd5e1",
                          border: isCurrent ? "4px solid #3b82f6" : "none",
                          boxShadow: isCurrent ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none"
                        }}
                      ></span>

                      <h6 className={`fw-bold mb-1 ${isDone ? "text-dark" : "text-muted"}`}>
                        {m.label}
                      </h6>
                      <p className="small text-muted mb-0">{m.desc}</p>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Courier driver bio card */}
            {order.deliveryPartnerId && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <h5 className="fw-bold text-dark mb-3">Courier Associate</h5>
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "48px", height: "48px", fontSize: "18px" }}
                  >
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Delivery Agent</h6>
                    <div className="small text-muted mb-1">Vehicle: {order.deliveryPartnerId?.deliveryPartnerDetails?.vehicleType || "Motorcycle"}</div>
                    <div className="small text-muted font-monospace">No: {order.deliveryPartnerId?.deliveryPartnerDetails?.vehicleNumber || "Verified"}</div>
                  </div>
                </div>

                <div className="border-top mt-3 pt-3 d-flex gap-2">
                  <a href={`tel:${order.deliveryPartnerId?.phone || "9999999999"}`} className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-semibold">
                    <i className="bi bi-telephone-fill me-1.5"></i> Call Agent
                  </a>
                  <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm rounded-pill w-100 fw-semibold">
                    <i className="bi bi-chat-fill me-1.5"></i> Message Agent
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Map simulation column */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4">
              <div className="p-4 border-bottom bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Simulated Courier GPS Map</h5>
                <span className="badge bg-success">Live Track Enabled</span>
              </div>
              
              {/* Interactive SVG path widget representing GPS */}
              <div className="p-5 text-center bg-dark position-relative" style={{ height: "350px" }}>
                
                {/* SVG path mapping */}
                <svg width="100%" height="100%" viewBox="0 0 600 240" className="w-100">
                  {/* Grid Lines */}
                  <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="180" x2="600" y2="180" stroke="rgba(255,255,255,0.05)" />

                  {/* Route Dotted Path Line */}
                  <path 
                    d="M 60 120 C 180 40, 420 200, 540 120" 
                    fill="none" 
                    stroke="rgba(255, 255, 255, 0.2)" 
                    strokeWidth="4" 
                    strokeDasharray="8,8"
                  />

                  {/* Merchant Hub Point */}
                  <g transform="translate(60, 120)">
                    <circle r="14" fill="#3b82f6" opacity="0.3" />
                    <circle r="8" fill="#3b82f6" />
                    <text y="-20" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">Zonda Store Hub</text>
                  </g>

                  {/* Customer Drop Point */}
                  <g transform="translate(540, 120)">
                    <circle r="14" fill="#ef4444" opacity="0.3" />
                    <circle r="8" fill="#ef4444" />
                    <text y="-20" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">Your Address</text>
                  </g>

                  {/* Vehicle moving coordinates calculations */}
                  {/* M 60 120 C 180 40, 420 200, 540 120 */}
                  {/* Simple cubic bezier mapping at percentage */}
                  {(() => {
                    const t = progressPct / 100;
                    const x = (1-t)**3 * 60 + 3*(1-t)**2 * t * 180 + 3*(1-t) * t**2 * 420 + t**3 * 540;
                    const y = (1-t)**3 * 120 + 3*(1-t)**2 * t * 40 + 3*(1-t) * t**2 * 200 + t**3 * 120;
                    
                    return (
                      <g transform={`translate(${x}, ${y})`}>
                        <circle r="22" fill="#eab308" opacity="0.3" />
                        <circle r="15" fill="#eab308" />
                        {/* Vehicle Icon */}
                        <text x="-6" y="5" fill="#000" fontSize="14" fontWeight="bold">
                          {order.deliveryPartnerId?.deliveryPartnerDetails?.vehicleType === "car" ? "🚗" : "🏍️"}
                        </text>
                      </g>
                    );
                  })()}

                </svg>

                {/* Legend indicator overlay */}
                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-opacity-75 bg-black text-white d-flex justify-content-center gap-4 small">
                  <div><span className="badge bg-primary me-1.5">●</span> Merchant Store</div>
                  <div><span className="badge bg-warning text-dark me-1.5">●</span> Delivery Agent</div>
                  <div><span className="badge bg-danger me-1.5">●</span> Shipping Destination</div>
                </div>
              </div>
            </div>

            {/* Ratings Form - visible only when delivered */}
            {deliveryStatus === "Delivered" && !order.deliveryRating && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4 animate-fade-in">
                <h5 className="fw-bold text-dark mb-3">Rate Your Delivery Experience</h5>
                {ratingSuccess ? (
                  <div className="alert alert-success border-0 small p-2.5">{ratingSuccess}</div>
                ) : (
                  <form onSubmit={handleRateDelivery}>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-semibold">Select Stars</label>
                      <div className="d-flex gap-2 mb-2 text-warning fs-4" style={{ cursor: "pointer" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i 
                            key={star} 
                            onClick={() => setRating(star)}
                            className={`bi ${star <= rating ? "bi-star-fill" : "bi-star"}`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-semibold">Review / Comments</label>
                      <textarea 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Write a comment about the delivery..."
                        className="form-control"
                        rows="2"
                        style={{ borderRadius: "10px" }}
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={ratingLoading}
                      className="btn btn-warning btn-sm rounded-pill fw-bold px-4 py-2 text-dark"
                    >
                      {ratingLoading ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* If already rated */}
            {order.deliveryRating > 0 && (
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <h5 className="fw-bold text-dark mb-2">Delivery Feedback Submitted</h5>
                <div className="text-warning mb-2">
                  {Array.from({ length: order.deliveryRating }).map((_, i) => (
                    <i className="bi bi-star-fill me-1" key={i}></i>
                  ))}
                  <span className="text-muted small ms-2">({order.deliveryRating}/5 Stars)</span>
                </div>
                {order.deliveryFeedback && <p className="small text-muted mb-0">"{order.deliveryFeedback}"</p>}
              </div>
            )}

            {/* Complaints panel */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Report Issues / Complaints</h5>
              {reportSuccess ? (
                <div className="alert alert-success border-0 small p-2.5">{reportSuccess}</div>
              ) : (
                <form onSubmit={handleReportIssue}>
                  <div className="mb-3">
                    <input 
                      type="text" 
                      placeholder="e.g. Broken packaging, delayed pickup..."
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      className="form-control"
                      style={{ borderRadius: "10px", fontSize: "14px" }}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-outline-danger btn-sm rounded-pill px-4 py-1.5 fw-semibold">
                    Submit Dispute Request
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CustomerTrackDelivery;
