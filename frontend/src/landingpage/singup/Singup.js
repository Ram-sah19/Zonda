import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Singup() {
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();
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
    if (!formData.name.trim()) {
      tempErrors.name = "Full name is required";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
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

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
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

    const result = await signup(formData.name, formData.email, formData.password);

    setIsSubmitting(false);

    if (result.success) {
      setApiSuccess("Registration successful! Redirecting to Home...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setApiError(result.error || "Registration failed. Email might already be taken.");
    }
  };

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
          maxWidth: "460px",
          borderRadius: "20px",
        }}
      >
        <div className="card-body">
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3 animate-float"
              style={{ width: "56px", height: "56px", fontSize: "22px", boxShadow: "0 8px 16px rgba(13, 110, 253, 0.2)" }}
            >
              <i className="bi bi-person-plus-fill"></i>
            </div>
            <h3 className="fw-bold text-dark mb-1">Create Account</h3>
            <p className="text-muted small">Sign up to access exclusive Zonda deals and products</p>
          </div>

          {apiError && (
            <div className="alert alert-danger d-flex align-items-center gap-2 border-0 rounded-3 mb-3 p-2.5" style={{ fontSize: "13px" }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <div>{apiError}</div>
            </div>
          )}

          {apiSuccess && (
            <div className="alert alert-success d-flex align-items-center gap-2 border-0 rounded-3 mb-3 p-2.5" style={{ fontSize: "13px" }}>
              <i className="bi bi-check-circle-fill"></i>
              <div>{apiSuccess}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group mb-3">
              <label className="form-label fw-semibold text-dark small mb-1">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "10px 0 0 10px", borderColor: errors.name ? "#dc3545" : "#cbd5e1" }}>
                  <i className="bi bi-person text-muted"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`form-control border-start-0 ${errors.name ? "is-invalid" : ""}`}
                  style={{
                    borderRadius: "0 10px 10px 0",
                    borderColor: errors.name ? "#dc3545" : "#cbd5e1",
                    fontSize: "14px",
                    padding: "10px 12px"
                  }}
                />
                {errors.name && <div className="invalid-feedback text-start">{errors.name}</div>}
              </div>
            </div>

            {/* Email Address */}
            <div className="form-group mb-3">
              <label className="form-label fw-semibold text-dark small mb-1">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "10px 0 0 10px", borderColor: errors.email ? "#dc3545" : "#cbd5e1" }}>
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={`form-control border-start-0 ${errors.email ? "is-invalid" : ""}`}
                  style={{
                    borderRadius: "0 10px 10px 0",
                    borderColor: errors.email ? "#dc3545" : "#cbd5e1",
                    fontSize: "14px",
                    padding: "10px 12px"
                  }}
                />
                {errors.email && <div className="invalid-feedback text-start">{errors.email}</div>}
              </div>
            </div>

            {/* Password */}
            <div className="form-group mb-3">
              <label className="form-label fw-semibold text-dark small mb-1">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "10px 0 0 10px", borderColor: errors.password ? "#dc3545" : "#cbd5e1" }}>
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`form-control border-start-0 border-end-0 ${errors.password ? "is-invalid" : ""}`}
                  style={{
                    borderRadius: "0",
                    borderColor: errors.password ? "#dc3545" : "#cbd5e1",
                    fontSize: "14px",
                    padding: "10px 12px"
                  }}
                />
                <button
                  type="button"
                  className="input-group-text bg-white border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    borderRadius: "0 10px 10px 0",
                    borderColor: errors.password ? "#dc3545" : "#cbd5e1",
                    cursor: "pointer"
                  }}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash text-muted" : "bi-eye text-muted"}`} style={{ fontSize: "16px" }}></i>
                </button>
                {errors.password && <div className="invalid-feedback text-start">{errors.password}</div>}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group mb-4">
              <label className="form-label fw-semibold text-dark small mb-1">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "10px 0 0 10px", borderColor: errors.confirmPassword ? "#dc3545" : "#cbd5e1" }}>
                  <i className="bi bi-shield-check text-muted"></i>
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`form-control border-start-0 border-end-0 ${errors.confirmPassword ? "is-invalid" : ""}`}
                  style={{
                    borderRadius: "0",
                    borderColor: errors.confirmPassword ? "#dc3545" : "#cbd5e1",
                    fontSize: "14px",
                    padding: "10px 12px"
                  }}
                />
                <button
                  type="button"
                  className="input-group-text bg-white border-start-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    borderRadius: "0 10px 10px 0",
                    borderColor: errors.confirmPassword ? "#dc3545" : "#cbd5e1",
                    cursor: "pointer"
                  }}
                >
                  <i className={`bi ${showConfirmPassword ? "bi-eye-slash text-muted" : "bi-eye text-muted"}`} style={{ fontSize: "16px" }}></i>
                </button>
                {errors.confirmPassword && <div className="invalid-feedback text-start">{errors.confirmPassword}</div>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
              style={{
                borderRadius: "10px",
                padding: "11px",
                fontSize: "14px",
                boxShadow: "0 4px 12px rgba(13, 110, 253, 0.15)",
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
                  Sign Up
                  <i className="bi bi-arrow-right-short"></i>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0 text-muted small">
              Already have an account?{" "}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Singup;
