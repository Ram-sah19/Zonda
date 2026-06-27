import React from 'react';

const Branddeal = () => {
  const brandDeals = [
    {
      brand: "Samsung",
      logo: "⚡",
      offer: "Galaxy Fest",
      discount: "Up to ₹15,000 Instant Off",
      desc: "Get exclusive upgrades and instant cashbacks on the Galaxy S24 Ultra & smart accessories.",
      image: "media/sam.webp",
      bg: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
      badgeColor: "#3b82f6"
    },
    {
      brand: "Lenovo",
      logo: "💻",
      offer: "Legion Week",
      discount: "Flat 15% Discount + Free Bag",
      desc: "Upgrade your gaming setup with ultimate RTX 40-series Lenovo Legion laptops at unbeatable pricing.",
      image: "media/legion.webp",
      bg: "linear-gradient(135deg, #180808 0%, #7f1d1d 100%)",
      badgeColor: "#ef4444"
    },
    {
      brand: "Sony",
      logo: "📺",
      offer: "Bravia Carnival",
      discount: "Extra ₹5,000 Off on Exchange",
      desc: "Immerse in breathtaking Dolby Vision detail with premium Google TV exchanges and bank offers.",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=60",
      bg: "linear-gradient(135deg, #050b14 0%, #1e1b4b 100%)",
      badgeColor: "#10b981"
    }
  ];

  return (
    <div className="my-5">
      <div className="border-bottom pb-3 mb-5">
        <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "12px", letterSpacing: "2px" }}>Exclusive Partner Offers</span>
        <h3 className="fw-extrabold mt-1 mb-2" style={{ color: "#0f172a", fontSize: "28px", fontWeight: "800" }}>Brand Spotlight Deals</h3>
        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>Handpicked flagship offers from our premium brand partners.</p>
      </div>

      <div className="row g-4">
        {brandDeals.map((deal, idx) => (
          <div key={idx} className="col-12 col-lg-4">
            <div 
              className="card border-0 text-white overflow-hidden shadow-sm h-100"
              style={{
                background: deal.bg,
                borderRadius: "20px",
                position: "relative",
                minHeight: "360px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Overlay graphics */}
              <div 
                className="position-absolute w-100 h-100"
                style={{
                  background: "radial-gradient(circle at 90% 10%, rgba(255,255,255,0.08) 0%, transparent 50%)",
                  pointerEvents: "none"
                }}
              />

              <div className="card-body p-4 d-flex flex-column justify-content-between h-100" style={{ zIndex: 2 }}>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-4">{deal.logo}</span>
                    <span 
                      className="badge px-3 py-1.5 text-uppercase fw-semibold"
                      style={{ backgroundColor: deal.badgeColor, fontSize: "10px", borderRadius: "6px" }}
                    >
                      {deal.offer}
                    </span>
                  </div>
                  <h4 className="fw-bold mb-2" style={{ fontSize: "22px" }}>{deal.brand}</h4>
                  <h5 className="fw-extrabold text-warning mb-3" style={{ fontSize: "18px" }}>{deal.discount}</h5>
                  <p className="text-light-emphasis" style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{deal.desc}</p>
                </div>

                <div className="mt-4 d-flex align-items-center justify-content-between">
                  <button 
                    className="btn btn-light btn-sm px-3 py-2 fw-semibold"
                    style={{ borderRadius: "8px", fontSize: "13px" }}
                  >
                    Claim Offer <i className="bi bi-arrow-right ms-1"></i>
                  </button>

                  <div style={{ width: "90px", height: "70px", overflow: "hidden" }}>
                    <img 
                      src={deal.image} 
                      alt={deal.brand} 
                      className="w-100 h-100"
                      style={{ objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Branddeal;
