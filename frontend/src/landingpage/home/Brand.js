import React from 'react';
import { useNavigate } from 'react-router-dom';

const Brand = () => {
  const navigate = useNavigate();

  const brands = [
    {
      name: 'Samsung',
      tag: 'Smartphones & TVs',
      desc: 'Pioneering screen technology and smart Galaxy AI devices.',
      icon: 'bi-phone',
      color: '#3b82f6',
      bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      productsCount: '12+ Products'
    },
    {
      name: 'Lenovo',
      tag: 'Laptops & Gaming',
      desc: 'Smarter technology for all, featuring ThinkPads & Legion beasts.',
      icon: 'bi-laptop',
      color: '#6366f1',
      bgGradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
      productsCount: '8+ Products'
    },
    {
      name: 'Sony',
      tag: 'Audio & Screens',
      desc: 'Cinematic Bravia 4K TVs and industry-leading ANC headphones.',
      icon: 'bi-tv',
      color: '#0f172a',
      bgGradient: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
      productsCount: '6+ Products'
    },
    {
      name: 'Dyson',
      tag: 'Smart Appliances',
      desc: 'High-end vacuums, air purifiers, and revolutionary hair care.',
      icon: 'bi-wind',
      color: '#ec4899',
      bgGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)',
      productsCount: '4+ Products'
    },
    {
      name: 'Mivi',
      tag: 'Audio & Acoustics',
      desc: 'Indian-engineered high-fidelity soundbars and earbuds.',
      icon: 'bi-headset',
      color: '#0d9488',
      bgGradient: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
      productsCount: '10+ Products'
    },
    {
      name: 'Zonda Originals',
      tag: 'Fragrances & Luxury',
      desc: 'Our exclusive signature collection of premium French elixirs.',
      icon: 'bi-gem',
      color: '#d97706',
      bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      productsCount: '5+ Products'
    }
  ];

  const handleBrandClick = (name) => {
    // Strip " Originals" or extra words for neat routing
    const cleanedName = name.replace(" Originals", "").toLowerCase();
    navigate(`/brand/${cleanedName}`);
  };

  return ( 
    <div className='container my-5 py-4'>
      <div className='text-center mb-5'>
        <span className='text-primary fw-bold text-uppercase' style={{ fontSize: "12px", letterSpacing: "1.5px" }}>Official Partners</span>
        <h2 className='fw-bold mt-2' style={{ fontSize: "32px", color: "#0f172a" }}>Brands in Spotlight</h2>
        <p className='text-muted mx-auto mb-0' style={{ fontSize: "15px", maxWidth: "600px" }}>Shop directly from official brand stores with verified warranties and exclusive discounts.</p>
      </div>
      
      <div className='row justify-content-center g-4'>
        {brands.map((brand, index) => (
          <div key={index} className='col-12 col-sm-6 col-lg-4 d-flex'>
            <div 
              className="brand-card p-4 d-flex flex-column justify-content-between w-100"
              onClick={() => handleBrandClick(brand.name)}
              style={{
                border: "1px solid var(--border-color)",
                position: "relative",
                cursor: "pointer",
                borderRadius: "16px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = brand.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--border-color)";
              }}
            >
              <div>
                {/* Header / Icon container */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: brand.bgGradient,
                      color: brand.color
                    }}
                  >
                    <i className={`bi ${brand.icon}`} style={{ fontSize: "24px" }}></i>
                  </div>
                  <span 
                    style={{ 
                      fontSize: "11px", 
                      fontWeight: "600", 
                      color: brand.color,
                      backgroundColor: `${brand.color}15`,
                      padding: "4px 10px",
                      borderRadius: "20px"
                    }}
                  >
                    {brand.productsCount}
                  </span>
                </div>

                {/* Content */}
                <h4 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                  {brand.name}
                </h4>
                <span className='text-muted d-block mb-3' style={{ fontSize: "12px", fontWeight: "600" }}>
                  {brand.tag}
                </span>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", margin: 0 }}>
                  {brand.desc}
                </p>
              </div>

              {/* Footer link */}
              <div 
                className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center" 
                style={{ borderColor: "#f1f5f9" }}
              >
                <span style={{ fontSize: "13px", fontWeight: "600", color: brand.color }}>
                  Explore Store
                </span>
                <i className="bi bi-arrow-right-short animate-arrow" style={{ fontSize: "20px", color: brand.color }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;