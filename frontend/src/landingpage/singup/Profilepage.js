import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Profilepage() {
  const { user, token, loading, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If auth state is loaded and there is no user/token, redirect to login
    if (!loading && !token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          }
        } catch (error) {
          console.error("Error fetching profile details:", error);
        }
      }
      setFetching(false);
    };

    if (!loading) {
      fetchProfile();
    }
  }, [loading, token, navigate]);

  if (loading || fetching) {
    return (
      <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading profile information...</p>
        </div>
      </div>
    );
  }

  // Fallback in case not logged in
  if (!user && !profileData) {
    return (
      <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="card glass-panel text-center p-5 shadow border-0" style={{ maxWidth: "400px", borderRadius: "20px" }}>
          <i className="bi bi-shield-lock text-danger" style={{ fontSize: "48px" }}></i>
          <h4 className="fw-bold mt-3 text-dark">Access Denied</h4>
          <p className="text-muted small">You need to log in to view this profile dashboard.</p>
          <Link to="/login" className="btn btn-primary mt-2 px-4 py-2" style={{ borderRadius: "10px" }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const displayUser = profileData || user;
  const memberSince = displayUser.createdAt
    ? new Date(displayUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  return (
    <div 
      className="container-fluid d-flex align-items-center justify-content-center py-5 animate-fade-in-up"
      style={{
        minHeight: "85vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
      }}
    >
      <div 
        className="card glass-panel shadow-lg border-0 p-4"
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "20px",
        }}
      >
        <div className="card-body">
          {/* Header */}
          <div className="d-flex align-items-center gap-3 border-bottom pb-4 mb-4">
            <div 
              className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold"
              style={{ width: "70px", height: "70px", fontSize: "28px", boxShadow: "0 8px 16px rgba(13, 110, 253, 0.15)" }}
            >
              {displayUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="fw-bold text-dark mb-1">{displayUser.name}</h4>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1">
                Zonda Gold Member
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-6">
              <div className="p-3 bg-white border rounded-3" style={{ borderColor: "#e2e8f0" }}>
                <p className="text-muted mb-1 small fw-semibold text-uppercase">Full Name</p>
                <p className="mb-0 fw-bold text-dark">{displayUser.name}</p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-3 bg-white border rounded-3" style={{ borderColor: "#e2e8f0" }}>
                <p className="text-muted mb-1 small fw-semibold text-uppercase">Email Address</p>
                <p className="mb-0 fw-bold text-dark text-truncate">{displayUser.email}</p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-3 bg-white border rounded-3" style={{ borderColor: "#e2e8f0" }}>
                <p className="text-muted mb-1 small fw-semibold text-uppercase">Account Status</p>
                <p className="mb-0 fw-bold text-success d-flex align-items-center gap-1.5">
                  <span className="d-inline-block rounded-circle bg-success" style={{ width: "8px", height: "8px" }}></span>
                  Active
                </p>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-3 bg-white border rounded-3" style={{ borderColor: "#e2e8f0" }}>
                <p className="text-muted mb-1 small fw-semibold text-uppercase">Member Since</p>
                <p className="mb-0 fw-bold text-dark">{memberSince}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-column flex-sm-row gap-3 pt-2">
            <Link 
              to="/" 
              className="btn btn-outline-secondary flex-fill fw-semibold py-2.5"
              style={{ borderRadius: "10px", fontSize: "14px" }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Store
            </Link>
            <button 
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="btn btn-danger flex-fill fw-semibold py-2.5 d-flex align-items-center justify-content-center gap-2"
              style={{ borderRadius: "10px", fontSize: "14px" }}
            >
              <i className="bi bi-box-arrow-right"></i>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profilepage;
