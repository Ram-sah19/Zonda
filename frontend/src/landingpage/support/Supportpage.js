import React, { useState } from 'react';

const Supportpage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const contactMethods = [
    {
      icon: "bi-chat-dots text-primary",
      title: "24/7 Live Chat Support",
      detail: "Speak directly with our team in real-time.",
      action: "Start Chat"
    },
    {
      icon: "bi-envelope text-success",
      title: "Email Assistance",
      detail: "Drop us an email. We typically reply within 2 hours.",
      action: "support@zonda.com"
    },
    {
      icon: "bi-telephone text-info",
      title: "Phone Hotlines",
      detail: "Call us for high-priority shipping updates.",
      action: "+1 (555) 019-2834"
    }
  ];

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        {/* Support Page Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary px-3 py-2 text-uppercase fw-bold mb-3" style={{ fontSize: "11px", letterSpacing: "1px" }}>Contact Zonda</span>
          <h1 className="fw-extrabold mt-2 mb-3" style={{ color: "#0f172a", fontSize: "36px", fontWeight: "800" }}>How Can We Help You?</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px", fontSize: "15px" }}>
            Got questions about products, shipping, or deals? Reach out to our dedicated support agents now.
          </p>
        </div>

        {/* Contact Methods Cards */}
        <div className="row g-4 mb-5">
          {contactMethods.map((method, idx) => (
            <div key={idx} className="col-12 col-md-4">
              <div className="card border-0 shadow-sm p-4 rounded-4 text-center bg-white h-100 transition-all" style={{ cursor: "pointer" }}>
                <div className="fs-1 mb-3">
                  <i className={`bi ${method.icon}`}></i>
                </div>
                <h5 className="fw-bold mb-2" style={{ color: "#1e293b" }}>{method.title}</h5>
                <p className="text-muted mb-4" style={{ fontSize: "13px" }}>{method.detail}</p>
                <button className="btn btn-light btn-sm w-100 fw-semibold py-2" style={{ borderRadius: "8px" }}>
                  {method.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form and Map Grid */}
        <div className="row g-4 align-items-stretch">
          
          {/* Contact Form Card */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white h-100">
              <h3 className="fw-bold mb-4" style={{ color: "#1e293b" }}>Send Us a Message</h3>
              
              {formSubmitted ? (
                <div className="alert alert-success border-0 rounded-3 py-4 text-center my-auto" role="alert">
                  <i className="bi bi-check-circle-fill display-5 text-success d-block mb-3"></i>
                  <h5 className="fw-bold">Message Sent Successfully!</h5>
                  <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>Thank you for reaching out. A support agent will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: "12px" }}>Your Name</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3 py-2.5 border"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: "12px" }}>Email Address</label>
                      <input 
                        type="email" 
                        className="form-control rounded-3 py-2.5 border"
                        placeholder="user@gmail.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: "12px" }}>Subject</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3 py-2.5 border"
                        placeholder="Order tracking query, returns info, etc."
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: "12px" }}>Message</label>
                      <textarea 
                        className="form-control rounded-3 border" 
                        rows="5"
                        placeholder="Tell us what you need help with..."
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary w-100 py-3 fw-semibold"
                        style={{ borderRadius: "8px" }}
                      >
                        Send Message <i className="bi bi-send ms-2"></i>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Quick Info & FAQ Card */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 text-white h-100" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
              <h3 className="fw-bold mb-4">Corporate Office</h3>
              
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="fs-5 text-primary"><i className="bi bi-geo-alt"></i></div>
                <div>
                  <h6 className="fw-bold mb-1 " >Headquarters</h6>
                  <p className="mb-0 " style={{ fontSize: "13px", color: "#8a8a8aff" }}>
                    Zonda Inc, Suite 400, Innovation Parkway, Tech District, Bangalore 
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="fs-5 text-primary"><i className="bi bi-clock"></i></div>
                <div>
                  <h6 className="fw-bold mb-1 ">Business Hours</h6>
                  <p className="mb-0 " style={{ fontSize: "13px", color: "#8a8a8aff" }}>
                    Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                    Saturday: 10:00 AM - 4:00 PM PST
                  </p>
                </div>
              </div>

              <div className="border-top border-secondary pt-4 mt-2">
                <h5 className="fw-bold mb-3">Frequently Asked Questions</h5>
                <div className="mb-3">
                  <h6 className="fw-semibold  mb-1" style={{ fontSize: "13px", color: "#eec603ff" }}>How can I track my order?</h6>
                  <p className=" mb-0" style={{ fontSize: "12px", color: "#8a8a8aff" }}>
                    Use the tracking number sent to your email or check the Order History in your Profile menu.
                  </p>
                </div>
                <div>
                  <h6 className="fw-semibold  mb-1" style={{ fontSize: "13px", color: "#eec603ff" }}>What is your return policy?</h6>
                  <p className=" mb-0" style={{ fontSize: "12px", color: "#8a8a8aff" }}>
                    We offer a 30-day hassle-free return window for all unopened products with receipt proof.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Supportpage;
