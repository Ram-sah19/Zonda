import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DeliveryRegister() {
  const { signupDeliveryPartner } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    vehicleType: "bike",
    vehicleNumber: "",
    licenseNumber: "",
    docType: "Aadhaar Card",
    docNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setApiError("");
  };

  const validateStep = (currentStep) => {
    const tempErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (currentStep === 1) {
      if (!formData.name) tempErrors.name = "Full name is required";
      if (!formData.email) {
        tempErrors.email = "Email is required";
      } else if (!emailRegex.test(formData.email)) {
        tempErrors.email = "Please enter a valid email address";
      }
      if (!formData.password) {
        tempErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        tempErrors.password = "Password must be at least 6 characters";
      }
    } else if (currentStep === 2) {
      if (!formData.vehicleNumber) tempErrors.vehicleNumber = "Vehicle registration number is required";
      if (!formData.licenseNumber) tempErrors.licenseNumber = "Driving license number is required";
      if (!formData.docNumber) tempErrors.docNumber = "Document identification number is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    setApiError("");
    setApiSuccess("");

    const result = await signupDeliveryPartner(formData);

    setIsSubmitting(false);

    if (result.success) {
      setApiSuccess("Application submitted successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/delivery/dashboard");
      }, 2000);
    } else {
      setApiError(result.error || "Onboarding failed. Please try again.");
    }
  };

  return (
    <div 
      className="container-fluid d-flex align-items-center justify-content-center py-5 animate-fade-in"
      style={{
        minHeight: "90vh",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      }}
    >
      <div 
        className="card border-0 shadow-2xl p-4 text-white"
        style={{
          width: "100%",
          maxWidth: "520px",
          borderRadius: "24px",
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        <div className="card-body">
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center bg-warning text-dark rounded-circle mb-3 animate-bounce-slow"
              style={{ width: "64px", height: "64px", fontSize: "28px" }}
            >
              <i className="bi bi-truck"></i>
            </div>
            <h3 className="fw-bold mb-1">Become a Delivery Partner</h3>
            <p className="text-muted small">Deliver happiness and earn on your own terms</p>

            {/* Stepper Indicators */}
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <span className={`badge rounded-pill px-3 py-2 ${step === 1 ? "bg-warning text-dark" : "bg-secondary text-light"}`}>
                1. Account Details
              </span>
              <div className="bg-secondary" style={{ width: "24px", height: "2px" }}></div>
              <span className={`badge rounded-pill px-3 py-2 ${step === 2 ? "bg-warning text-dark" : "bg-secondary text-light"}`}>
                2. Documents & Vehicle
              </span>
            </div>
          </div>

          {apiError && (
            <div className="alert alert-danger border-0 rounded-3 mb-3 p-3 small text-start d-flex align-items-center gap-2" style={{ background: "rgba(220, 53, 69, 0.2)", color: "#f87171" }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <div>{apiError}</div>
            </div>
          )}

          {apiSuccess && (
            <div className="alert alert-success border-0 rounded-3 mb-3 p-3 small text-start d-flex align-items-center gap-2" style={{ background: "rgba(25, 135, 84, 0.2)", color: "#4ade80" }}>
              <i className="bi bi-check-circle-fill"></i>
              <div>{apiSuccess}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="animate-fade-in-up">
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label text-light small fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`form-control bg-dark border-0 text-white ${errors.name ? "is-invalid" : ""}`}
                    style={{ borderRadius: "10px", padding: "11px", background: "rgba(15, 23, 42, 0.6)" }}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label text-light small fw-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="partner@zonda.com"
                    className={`form-control bg-dark border-0 text-white ${errors.email ? "is-invalid" : ""}`}
                    style={{ borderRadius: "10px", padding: "11px", background: "rgba(15, 23, 42, 0.6)" }}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label text-light small fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`form-control bg-dark border-0 text-white ${errors.password ? "is-invalid" : ""}`}
                    style={{ borderRadius: "10px", padding: "11px", background: "rgba(15, 23, 42, 0.6)" }}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-warning w-100 fw-bold py-2.5 text-dark d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: "10px" }}
                >
                  Continue to Documents
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in-up">
                {/* Vehicle Choice */}
                <div className="mb-3">
                  <label className="form-label text-light small fw-semibold">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="form-select bg-dark border-0 text-white"
                    style={{ borderRadius: "10px", padding: "11px", background: "rgba(15, 23, 42, 0.6)" }}
                  >
                    <option value="bike">Bicycle / Motorcycle</option>
                    <option value="car">Car</option>
                    <option value="van">Delivery Van</option>
                    <option value="truck">Logistics Truck</option>
                  </select>
                </div>

                {/* Vehicle Registration Number */}
                <div className="mb-3">
                  <label className="form-label text-light small fw-semibold">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g. KA-01-EF-1234"
                    className={`form-control bg-dark border-0 text-white ${errors.vehicleNumber ? "is-invalid" : ""}`}
                    style={{ borderRadius: "10px", padding: "11px", background: "rgba(15, 23, 42, 0.6)" }}
                  />
                  {errors.vehicleNumber && <div className="invalid-feedback">{errors.vehicleNumber}</div>}
                </div>

                {/* License Number */}
                <div className="mb-3">
                  <label className="form-label text-light small fw-semibold">Driving License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Enter your DL number"
                    className={`form-control bg-dark border-0 text-white ${errors.licenseNumber ? "is-invalid" : ""}`}
                    style={{ borderRadius: "10px", padding: "11px", background: "rgba(15, 23, 42, 0.6)" }}
                  />
                  {errors.licenseNumber && <div className="invalid-feedback">{errors.licenseNumber}</div>}
                </div>

                {/* Document Type and Verification Number */}
                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <label className="form-label text-light small fw-semibold">ID Proof Type</label>
                    <select
                      name="docType"
                      value={formData.docType}
                      onChange={handleChange}
                      className="form-select bg-dark border-0 text-white"
                      style={{ borderRadius: "10px", padding: "11px", background: "rgba(15, 23, 42, 0.6)" }}
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Passport">Passport</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label text-light small fw-semibold">Document Number</label>
                    <input
                      type="text"
                      name="docNumber"
                      value={formData.docNumber}
                      onChange={handleChange}
                      placeholder="Verification ID"
                      className={`form-control bg-dark border-0 text-white ${errors.docNumber ? "is-invalid" : ""}`}
                      style={{ borderRadius: "10px", padding: "11px", background: "rgba(15, 23, 42, 0.6)" }}
                    />
                    {errors.docNumber && <div className="invalid-feedback">{errors.docNumber}</div>}
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn btn-secondary w-50 fw-semibold py-2.5"
                    style={{ borderRadius: "10px" }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-warning w-50 fw-bold py-2.5 text-dark d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: "10px" }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        Submit Onboarding
                        <i className="bi bi-check-circle"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="text-center mt-4">
            <p className="mb-0 text-muted small">
              Already have an account?{" "}
              <Link to="/login" className="text-warning fw-semibold text-decoration-none">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryRegister;
