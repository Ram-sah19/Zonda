import React from 'react';
import Team from './Team';

const Aboutpage = () => {
    const values = [
        {
            icon: "bi-shield-check",
            title: "Uncompromising Quality",
            desc: "Every product in our catalog passes rigorous authenticity and quality standards, ensuring you receive only the best."
        },
        {
            icon: "bi-lightning-charge",
            title: "Lightning-Fast Execution",
            desc: "From rapid search results to swift checkout flows and dynamic order processing, speed is at the core of everything we do."
        },
        {
            icon: "bi-heart-pulse",
            title: "Customer-First Philosophy",
            desc: "Our support agents are available around the clock to assist you, ensuring a seamless, worry-free shopping experience."
        }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div 
                className="py-5 text-white position-relative overflow-hidden mb-5"
                style={{
                    background: "linear-gradient(135deg, #0b0f19 0%, #1e293b 100%)",
                }}
            >
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100" 
                    style={{
                        backgroundImage: "radial-gradient(circle at 10% 20%, rgba(13, 110, 253, 0.15) 0%, transparent 40%)",
                        pointerEvents: "none"
                    }}
                />
                <div className="container py-5 text-center position-relative" style={{ zIndex: 1 }}>
                    <span className="badge bg-primary px-3 py-2 text-uppercase fw-bold mb-3" style={{ letterSpacing: "1px", fontSize: "11px" }}>Our Story</span>
                    <h1 className="display-4 fw-extrabold mb-3" style={{ fontWeight: "800" }}>Redefining Smart E-Commerce</h1>
                    <p className="lead text-light-emphasis mx-auto mb-0" style={{ maxWidth: "650px", color: "#cbd5e1" }}>
                        At Zonda, we are building the fastest, most reliable catalog platform connecting users to world-class brands.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-4">
                <div className="row align-items-center mb-5 pb-4">
                    <div className="col-12 col-lg-6 mb-4 mb-lg-0 pr-lg-5">
                        <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "12px", letterSpacing: "2px" }}>Who We Are</span>
                        <h2 className="fw-extrabold mt-2 mb-4" style={{ color: "#0f172a", fontSize: "30px", fontWeight: "800" }}>Driven by Passion, Built for Innovation</h2>
                        <p className="text-muted" style={{ fontSize: "15px", lineHeight: "1.7" }}>
                            Zonda started with a simple yet ambitious vision: to create a premium e-commerce portal that removes the clutter from digital shopping. We believe that discovering and purchasing quality tech, gadgets, and luxury goods should be fluid, fast, and visual.
                        </p>
                        <p className="text-muted mb-0" style={{ fontSize: "15px", lineHeight: "1.7" }}>
                            Over the years, we've partnered with leading global manufacturers to bring an curated array of smart accessories, laptops, gaming gear, and home audio systems directly to your screens.
                        </p>
                    </div>
                    <div className="col-12 col-lg-6 d-flex justify-content-center">
                        <div className="position-relative" style={{ maxWidth: "85%" }}>
                            <img 
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80" 
                                alt="Zonda office" 
                                className="img-fluid rounded-4 shadow-lg"
                                style={{ transform: "rotate(-2deg)", border: "4px solid white" }}
                            />
                            <div 
                                className="position-absolute bg-primary text-white p-3 rounded-3 shadow d-none d-md-block"
                                style={{ bottom: "-20px", right: "-20px", transform: "rotate(3deg)" }}
                            >
                                <h4 className="fw-bold mb-0">50K+</h4>
                                <small>Happy Customers</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="my-5 py-3">
                    <div className="text-center mb-5">
                        <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "12px", letterSpacing: "2px" }}>Our Core Values</span>
                        <h2 className="fw-extrabold mt-2" style={{ color: "#0f172a", fontSize: "30px", fontWeight: "800" }}>What Stands Us Apart</h2>
                    </div>

                    <div className="row g-4">
                        {values.map((val, index) => (
                            <div key={index} className="col-12 col-md-4">
                                <div 
                                    className="card border-0 h-100 p-4 shadow-sm"
                                    style={{
                                        borderRadius: "16px",
                                        background: "#f8fafc",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.background = "#ffffff";
                                        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.background = "#f8fafc";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <div 
                                        className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center mb-4"
                                        style={{ width: "48px", height: "48px" }}
                                    >
                                        <i className={`bi ${val.icon}`} style={{ fontSize: "20px" }}></i>
                                    </div>
                                    <h4 className="fw-bold mb-3" style={{ fontSize: "18px", color: "#1e293b" }}>{val.title}</h4>
                                    <p className="text-muted mb-0" style={{ fontSize: "14px", lineHeight: "1.6" }}>{val.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Component */}
                <Team />
            </div>
        </div>
    );
};

export default Aboutpage;