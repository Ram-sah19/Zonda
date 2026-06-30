import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SellerRegister() {
  const { signupSeller, user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessContact: "",
    businessAddress: "",
    taxId: "",
    bankName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    idDocType: "GST Certificate",
    idDocNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    
    // Personal Validation
    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    
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

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    // Business Validation
    if (!formData.businessName.trim()) tempErrors.businessName = "Business name is required";
    if (!formData.businessContact.trim()) tempErrors.businessContact = "Business contact is required";
    if (!formData.businessAddress.trim()) tempErrors.businessAddress = "Business address is required";
    if (!formData.taxId.trim()) tempErrors.taxId = "Tax / GST ID is required";

    // Bank Validation
    if (!formData.bankName.trim()) tempErrors.bankName = "Bank name is required";
    if (!formData.bankAccountNumber.trim()) tempErrors.bankAccountNumber = "Account number is required";
    if (!formData.bankIfscCode.trim()) tempErrors.bankIfscCode = "IFSC / Routing code is required";

    // Document Validation
    if (!formData.idDocNumber.trim()) tempErrors.idDocNumber = "Document number is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setApiError("Please correct the errors in the registration form.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setApiError("");
    setApiSuccess("");

    // If user is currently logged in as a buyer, logout first
    if (user && !user.isSeller) {
      logout();
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      businessName: formData.businessName,
      businessContact: formData.businessContact,
      businessAddress: formData.businessAddress,
      taxId: formData.taxId,
      bankInfo: {
        accountNumber: formData.bankAccountNumber,
        ifscCode: formData.bankIfscCode,
        bankName: formData.bankName
      },
      idVerification: {
        docType: formData.idDocType,
        docNumber: formData.idDocNumber,
        docUrl: "" // Optional placeholder for document
      }
    };

    const result = await signupSeller(payload);
    setIsSubmitting(false);

    if (result.success) {
      setApiSuccess("Seller account registered successfully! Redirecting to Dashboard...");
      setTimeout(() => {
        navigate("/seller");
      }, 1500);
    } else {
      setApiError(result.error || "Registration failed. Email might already be taken.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div 
      className="container-fluid py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
      }}
    >
      <div className="container">
        <div 
          className="card border-0 shadow-lg p-4 p-md-5 mx-auto animate-fade-in-up"
          style={{
            maxWidth: "850px",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 fw-bold text-uppercase mb-2" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>
              Partner Onboarding
            </span>
            <h2 className="fw-extrabold text-dark" style={{ fontWeight: "800" }}>Register as a Seller</h2>
            <p className="text-muted">Fill out the required information to create your merchant account and access the dashboard.</p>
          </div>

          {/* Active Session Warning */}
          {user && !user.isSeller && (
            <div className="alert alert-warning border-0 rounded-4 p-3 mb-4 d-flex align-items-start gap-3 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill fs-4 text-warning"></i>
              <div>
                <h6 className="fw-bold mb-1">Currently Signed In as Buyer ({user.name})</h6>
                <p className="mb-0 text-muted small">
                  Submitting this form will automatically sign you out of your current buyer account and register a separate seller account. Buyer and seller accounts remain fully independent.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {apiError && (
            <div className="alert alert-danger d-flex align-items-center gap-2 border-0 rounded-3 mb-4 p-3" style={{ fontSize: "14px" }}>
              <i className="bi bi-exclamation-octagon-fill"></i>
              <div>{apiError}</div>
            </div>
          )}

          {apiSuccess && (
            <div className="alert alert-success d-flex align-items-center gap-2 border-0 rounded-3 mb-4 p-3" style={{ fontSize: "14px" }}>
              <i className="bi bi-check-circle-fill"></i>
              <div>{apiSuccess}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            
            {/* SECTION 1: Personal & Account Details */}
            <div className="mb-5">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-4 d-flex align-items-center gap-2">
                <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "26px", height: "26px", fontSize: "12px" }}>1</span>
                Personal & Account Details
              </h5>
              
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter owner's full name"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="merchant@example.com"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Password *</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      placeholder="Min 6 characters"
                      style={{ borderRadius: "10px 0 0 10px", padding: "10px 12px" }}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-white border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ borderRadius: "0 10px 10px 0", cursor: "pointer" }}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash text-muted" : "bi-eye text-muted"}`}></i>
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Confirm Password *</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      placeholder="Confirm password"
                      style={{ borderRadius: "10px 0 0 10px", padding: "10px 12px" }}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-white border-start-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ borderRadius: "0 10px 10px 0", cursor: "pointer" }}
                    >
                      <i className={`bi ${showConfirmPassword ? "bi-eye-slash text-muted" : "bi-eye text-muted"}`}></i>
                    </button>
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Business Information */}
            <div className="mb-5">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-4 d-flex align-items-center gap-2">
                <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "26px", height: "26px", fontSize: "12px" }}>2</span>
                Business Information
              </h5>
              
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Registered Business Name *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className={`form-control ${errors.businessName ? "is-invalid" : ""}`}
                    placeholder="e.g. Acmo Electronics Ltd"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.businessName && <div className="invalid-feedback">{errors.businessName}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Business Contact Number *</label>
                  <input
                    type="text"
                    name="businessContact"
                    value={formData.businessContact}
                    onChange={handleChange}
                    className={`form-control ${errors.businessContact ? "is-invalid" : ""}`}
                    placeholder="e.g. +91 98765 43210"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.businessContact && <div className="invalid-feedback">{errors.businessContact}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-muted small mb-1">Business Address *</label>
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    className={`form-control ${errors.businessAddress ? "is-invalid" : ""}`}
                    rows={3}
                    placeholder="Enter complete office/warehouse address"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.businessAddress && <div className="invalid-feedback">{errors.businessAddress}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Tax / GST Identification Number *</label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    className={`form-control ${errors.taxId ? "is-invalid" : ""}`}
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.taxId && <div className="invalid-feedback">{errors.taxId}</div>}
                </div>
              </div>
            </div>

            {/* SECTION 3: Bank & Identity Verification Details */}
            <div className="mb-5">
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-4 d-flex align-items-center gap-2">
                <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "26px", height: "26px", fontSize: "12px" }}>3</span>
                Bank & Verification Details
              </h5>
              
              <div className="row g-3">
                {/* Bank Info */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold text-muted small mb-1">Bank Name *</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className={`form-control ${errors.bankName ? "is-invalid" : ""}`}
                    placeholder="e.g. HDFC Bank"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.bankName && <div className="invalid-feedback">{errors.bankName}</div>}
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold text-muted small mb-1">Account Number *</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    className={`form-control ${errors.bankAccountNumber ? "is-invalid" : ""}`}
                    placeholder="e.g. 50100234567890"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.bankAccountNumber && <div className="invalid-feedback">{errors.bankAccountNumber}</div>}
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold text-muted small mb-1">IFSC / Routing Code *</label>
                  <input
                    type="text"
                    name="bankIfscCode"
                    value={formData.bankIfscCode}
                    onChange={handleChange}
                    className={`form-control ${errors.bankIfscCode ? "is-invalid" : ""}`}
                    placeholder="e.g. HDFC0000123"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.bankIfscCode && <div className="invalid-feedback">{errors.bankIfscCode}</div>}
                </div>

                {/* ID Doc Verification */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Verification Document Type *</label>
                  <select
                    name="idDocType"
                    value={formData.idDocType}
                    onChange={handleChange}
                    className="form-select"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  >
                    <option value="GST Certificate">GST Certificate</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Passport">Passport</option>
                    <option value="National Identity Document">National Identity Card</option>
                    <option value="Business Registration License">Business License</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-muted small mb-1">Document ID Number *</label>
                  <input
                    type="text"
                    name="idDocNumber"
                    value={formData.idDocNumber}
                    onChange={handleChange}
                    className={`form-control ${errors.idDocNumber ? "is-invalid" : ""}`}
                    placeholder="Enter document number"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  {errors.idDocNumber && <div className="invalid-feedback">{errors.idDocNumber}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-muted small mb-1">Upload Identity Verification Document (Optional, mock validation)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.png,.jpg,.jpeg"
                    style={{ borderRadius: "10px", padding: "10px 12px" }}
                  />
                  <div className="form-text small">Accepted formats: PDF, PNG, JPG (Max 5MB). Submitting mock docs is fine.</div>
                </div>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 pt-3 border-top" style={{ borderColor: "#f1f5f9" }}>
              <Link 
                to="/seller" 
                className="btn btn-light py-2.5 px-4 fw-semibold flex-fill flex-sm-grow-0"
                style={{ borderRadius: "10px", fontSize: "14px" }}
              >
                Back to Benefits
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary py-2.5 px-5 fw-bold flex-fill"
                style={{
                  borderRadius: "10px",
                  fontSize: "14px",
                  boxShadow: "0 4px 12px rgba(13, 110, 253, 0.15)",
                  transition: "all 0.3s ease",
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering Merchant...
                  </>
                ) : (
                  <>
                    <i className="bi bi-shield-check me-2"></i>
                    Complete Registration
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default SellerRegister;
