import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signupAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setApiError("");
  };

  const validate = () => {
    const tempErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.name.trim()) {
      tempErrors.name = "Full name is required";
    }

    if (!formData.email) {
      tempErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError("");
    setApiSuccess("");

    const result = await signupAdmin(formData.name, formData.email, formData.password);

    setIsSubmitting(false);

    if (result.success) {
      setApiSuccess(`Administrator account registered successfully! Promoting and redirecting to Dashboard...`);
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } else {
      setApiError(result.error || "Failed to register administrator account.");
    }
  };

  return (
    <div 
      className="container-fluid d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: "85vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      <div 
        className="card shadow-lg border-0 p-4"
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "20px",
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#f8fafc"
        }}
      >
        <div className="card-body">
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center bg-info text-dark rounded-circle mb-3"
              style={{ width: "56px", height: "56px", fontSize: "22px", boxShadow: "0 8px 16px rgba(13, 202, 240, 0.25)" }}
            >
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h3 className="fw-bold mb-1" style={{ color: "#f8fafc" }}>Admin Sign Up</h3>
            <p className="text-info small opacity-75">Create a secure platform administrator account</p>
          </div>

          {apiError && (
            <div className="alert alert-danger d-flex align-items-center gap-2 border-0 rounded-3 mb-3 p-2.5" style={{ fontSize: "13px", backgroundColor: "rgba(220, 53, 69, 0.15)", color: "#f87171" }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <div>{apiError}</div>
            </div>
          )}

          {apiSuccess && (
            <div className="alert alert-success d-flex align-items-center gap-2 border-0 rounded-3 mb-3 p-2.5" style={{ fontSize: "13px", backgroundColor: "rgba(25, 135, 84, 0.15)", color: "#34d399" }}>
              <i className="bi bi-check-circle-fill"></i>
              <div>{apiSuccess}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group mb-3 text-start">
              <label className="form-label fw-semibold small mb-1" style={{ color: "#cbd5e1" }}>Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderRadius: "10px 0 0 10px", borderColor: errors.name ? "#dc3545" : "rgba(255, 255, 255, 0.15)", color: "#94a3b8" }}>
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`form-control bg-transparent border-start-0 text-white ${errors.name ? "is-invalid" : ""}`}
                  style={{
                    borderRadius: "0 10px 10px 0",
                    borderColor: errors.name ? "#dc3545" : "rgba(255, 255, 255, 0.15)",
                    fontSize: "14px",
                    padding: "10px 12px"
                  }}
                />
                {errors.name && <div className="invalid-feedback text-start">{errors.name}</div>}
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group mb-3 text-start">
              <label className="form-label fw-semibold small mb-1" style={{ color: "#cbd5e1" }}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderRadius: "10px 0 0 10px", borderColor: errors.email ? "#dc3545" : "rgba(255, 255, 255, 0.15)", color: "#94a3b8" }}>
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@zonda.com"
                  className={`form-control bg-transparent border-start-0 text-white ${errors.email ? "is-invalid" : ""}`}
                  style={{
                    borderRadius: "0 10px 10px 0",
                    borderColor: errors.email ? "#dc3545" : "rgba(255, 255, 255, 0.15)",
                    fontSize: "14px",
                    padding: "10px 12px"
                  }}
                />
                {errors.email && <div className="invalid-feedback text-start">{errors.email}</div>}
              </div>
            </div>

            {/* Password */}
            <div className="form-group mb-3 text-start">
              <label className="form-label fw-semibold small mb-1" style={{ color: "#cbd5e1" }}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderRadius: "10px 0 0 10px", borderColor: errors.password ? "#dc3545" : "rgba(255, 255, 255, 0.15)", color: "#94a3b8" }}>
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`form-control bg-transparent border-start-0 border-end-0 text-white ${errors.password ? "is-invalid" : ""}`}
                  style={{
                    borderRadius: "0",
                    borderColor: errors.password ? "#dc3545" : "rgba(255, 255, 255, 0.15)",
                    fontSize: "14px",
                    padding: "10px 12px"
                  }}
                />
                <button
                  type="button"
                  className="input-group-text bg-transparent border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    borderRadius: "0 10px 10px 0",
                    borderColor: errors.password ? "#dc3545" : "rgba(255, 255, 255, 0.15)",
                    cursor: "pointer",
                    color: "#94a3b8"
                  }}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} style={{ fontSize: "16px" }}></i>
                </button>
                {errors.password && <div className="invalid-feedback text-start">{errors.password}</div>}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group mb-4 text-start">
              <label className="form-label fw-semibold small mb-1" style={{ color: "#cbd5e1" }}>Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0" style={{ borderRadius: "10px 0 0 10px", borderColor: errors.confirmPassword ? "#dc3545" : "rgba(255, 255, 255, 0.15)", color: "#94a3b8" }}>
                  <i className="bi bi-check-lg"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`form-control bg-transparent border-start-0 text-white ${errors.confirmPassword ? "is-invalid" : ""}`}
                  style={{
                    borderRadius: "0 10px 10px 0",
                    borderColor: errors.confirmPassword ? "#dc3545" : "rgba(255, 255, 255, 0.15)",
                    fontSize: "14px",
                    padding: "10px 12px"
                  }}
                />
                {errors.confirmPassword && <div className="invalid-feedback text-start">{errors.confirmPassword}</div>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-info w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{
                borderRadius: "10px",
                padding: "11px",
                fontSize: "14px",
                color: "#0f172a",
                boxShadow: "0 4px 12px rgba(13, 202, 240, 0.2)",
                transition: "all 0.3s ease",
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Register Admin
                  <i className="bi bi-shield-check"></i>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4 border-top pt-3 border-secondary border-opacity-25">
            <p className="mb-0 text-muted small">
              Already have an admin account?{" "}
              <Link to="/login" className="text-info fw-semibold text-decoration-none">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
