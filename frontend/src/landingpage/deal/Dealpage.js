import React, { useState, useEffect } from 'react';
import Branddeal from './Branddeal';

const Dealpage = () => {
  // Flash sale countdown timer state (initially 5 hours)
  const [timeLeft, setTimeLeft] = useState(18000); // 5 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: String(hrs).padStart(2, '0'),
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
    };
  };

  const time = formatTime(timeLeft);

  const dealProducts = [
    {
      id: 1,
      name: "Buds Pro Gen 2",
      desc: "Active Noise Cancellation, 40 Hours Playback",
      price: "₹999",
      originalPrice: "₹1,999",
      discount: "50% OFF",
      rating: 4,
      image: "media/bud.webp",
      endsIn: "Today"
    },
    {
      id: 2,
      name: "Mivi Soundbar 100W",
      desc: "Deep Bass Home Theater, 2.1 Channel Cinema Sound",
      price: "₹3,999",
      originalPrice: "₹7,999",
      discount: "50% OFF",
      rating: 4,
      image: "media/mivi.webp",
      endsIn: "Today"
    },
    {
      id: 3,
      name: "Nova 2 Neo 5G",
      desc: "6000mAh Battery, 48MP Dual Sony Camera",
      price: "₹12,999",
      originalPrice: "₹17,999",
      discount: "27% OFF",
      rating: 4,
      image: "media/-original-imahgeusscuw8ezf.webp",
      endsIn: "2 Days"
    },
    {
      id: 4,
      name: "Zonda Luxury Perfume",
      desc: "An exquisite French fragrance elixir blending cedarwood and amber.",
      price: "₹1,499",
      originalPrice: "₹2,499",
      discount: "40% OFF",
      rating: 5,
      image: "media/per.webp",
      endsIn: "Today"
    }
  ];

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        {/* Deal Hero Section */}
        <div 
          className="p-4 p-md-5 rounded-4 text-white mb-5 shadow"
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Decorative background shapes */}
          <div 
            className="position-absolute"
            style={{
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
              top: "-50px",
              right: "-50px"
            }}
          />

          <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
            <div className="col-12 col-lg-7 mb-4 mb-lg-0">
              <span className="badge bg-danger px-3 py-2 text-uppercase fw-bold mb-3" style={{ fontSize: "11px", letterSpacing: "1px" }}>Flash Sale Live</span>
              <h1 className="display-4 fw-extrabold mb-3" style={{ fontWeight: "800" }}>Grab the Best Discounts!</h1>
              <p className="lead text-light-emphasis mb-0" style={{ color: "#cbd5e1" }}>
                Exclusive weekly deals, price drops, and limited-time vouchers compiled only for you.
              </p>
            </div>
            
            {/* Live Countdown Timer */}
            <div className="col-12 col-lg-5 d-flex justify-content-lg-end">
              <div 
                className="p-4 rounded-4 text-center d-inline-block shadow-lg border"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  minWidth: "280px"
                }}
              >
                <span className="text-warning fw-bold text-uppercase d-block mb-3" style={{ fontSize: "12px", letterSpacing: "1.5px" }}>Ends In</span>
                <div className="d-flex justify-content-center align-items-center gap-3">
                  <div>
                    <span className="fs-1 fw-extrabold text-white d-block" style={{ fontWeight: 800 }}>{time.hours}</span>
                    <small className="text-light-emphasis" style={{ fontSize: "11px" }}>Hours</small>
                  </div>
                  <span className="fs-2 text-white-50">:</span>
                  <div>
                    <span className="fs-1 fw-extrabold text-white d-block" style={{ fontWeight: 800 }}>{time.minutes}</span>
                    <small className="text-light-emphasis" style={{ fontSize: "11px" }}>Mins</small>
                  </div>
                  <span className="fs-2 text-white-50">:</span>
                  <div>
                    <span className="fs-1 fw-extrabold text-white d-block" style={{ fontWeight: 800 }}>{time.seconds}</span>
                    <small className="text-light-emphasis" style={{ fontSize: "11px" }}>Secs</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Spotlight deals */}
        <Branddeal />

        {/* Hot Deals Products Grid */}
        <div className="my-5 pt-3">
          <div className="border-bottom pb-3 mb-5">
            <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "12px", letterSpacing: "2px" }}>Daily Offers</span>
            <h3 className="fw-extrabold mt-1 mb-2" style={{ color: "#0f172a", fontSize: "28px", fontWeight: "800" }}>Lightning Deals</h3>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>Hurry up! Prices increase as soon as the countdown hits zero.</p>
          </div>

          <div className="row g-4">
            {dealProducts.map((prod) => (
              <div key={prod.id} className="col-12 col-sm-6 col-lg-3 d-flex align-items-stretch">
                <div 
                  className="card border-0 shadow-sm overflow-hidden w-100 d-flex flex-column justify-content-between position-relative"
                  style={{
                    borderRadius: "16px",
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.06)";
                    e.currentTarget.style.border = "1px solid #0d6efd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.02)";
                    e.currentTarget.style.border = "none";
                  }}
                >
                  {/* Discount Badge */}
                  <span 
                    className="position-absolute badge rounded-pill bg-danger"
                    style={{
                      top: "12px",
                      left: "12px",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "6px 12px",
                      zIndex: 1
                    }}
                  >
                    {prod.discount}
                  </span>

                  {/* Image Area */}
                  <div 
                    className="p-4 d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: "#f8fafc",
                      height: "170px",
                      borderBottom: "1px solid #f1f5f9"
                    }}
                  >
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      style={{
                        maxWidth: "80%",
                        maxHeight: "80%",
                        objectFit: "contain"
                      }}
                    />
                  </div>

                  {/* Details Area */}
                  <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      {/* Rating */}
                      <div className="d-flex gap-1 mb-2 text-warning" style={{ fontSize: "11px" }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i key={i} className={`bi ${i < prod.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                        ))}
                      </div>

                      <h5 className="fw-bold mb-1" style={{ fontSize: "15px", color: "#1e293b" }}>{prod.name}</h5>
                      <p className="text-muted mb-3" style={{ fontSize: "12px", lineHeight: "1.4", height: "34px", overflow: "hidden" }}>
                        {prod.desc}
                      </p>
                    </div>

                    <div>
                      <div className="d-flex align-items-baseline gap-2 mb-3">
                        <span className="fs-5 fw-bold text-danger">{prod.price}</span>
                        <span className="text-muted text-decoration-line-through" style={{ fontSize: "12px" }}>{prod.originalPrice}</span>
                      </div>

                      <div className="d-flex align-items-center justify-content-between bg-light rounded-3 px-3 py-1.5" style={{ fontSize: "11px" }}>
                        <span className="text-muted"><i className="bi bi-clock me-1"></i>Ends in:</span>
                        <span className="fw-semibold text-dark">{prod.endsIn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dealpage;
