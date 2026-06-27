import React from 'react';

function Interesting() {
    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#0d6efd" className="bi bi-truck" viewBox="0 0 16 16">
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.737 11h5.526a2 2 0 0 1 3.442 0H14.5a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4.5h-1.294a2 2 0 0 1-2.916-2.916L1.294 10.912z"/>
                </svg>
            ),
            title: "Free & Fast Delivery",
            desc: "On all orders above ₹499. Super-fast shipping directly to your doorstep."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#0d6efd" className="bi bi-shield-check" viewBox="0 0 16 16">
                    <path d="M5.338 1.59a.5.5 0 0 0-.242.047L1.096 3.66a.5.5 0 0 0-.296.457v7.5c0 3.606 2.927 6.5 6.5 6.5s6.5-2.894 6.5-6.5v-7.5a.5.5 0 0 0-.296-.457L9.904 1.637a.5.5 0 0 0-.404 0L5.338 1.59zm.732 1.48L9 2.9l3.418.847v6.603c0 3.038-2.42 5.5-5.418 5.5s-5.418-2.462-5.418-5.5V3.747l3.49-.877z"/>
                    <path d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                </svg>
            ),
            title: "Secure Payments",
            desc: "100% secure payment systems supporting UPI, Cards, and NetBanking."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#0d6efd" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                </svg>
            ),
            title: "Easy Returns",
            desc: "14-day hassle-free return policy. Get refunds initiated within 24 hours."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#0d6efd" className="bi bi-headset" viewBox="0 0 16 16">
                    <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z"/>
                </svg>
            ),
            title: "24/7 Dedicated Support",
            desc: "Connect with our expert customer care anytime via call, chat, or email."
        }
    ];

    return ( 
        <div className="container my-5 py-4">
            <div className="row g-4 align-items-center">
                
                {/* Left Side: Promo Card Banner */}
                <div className="col-12 col-lg-6">
                    <div 
                        style={{
                            height: "360px",
                            borderRadius: "16px",
                            backgroundColor: "#0f172a",
                            color: "#ffffff",
                            backgroundImage: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "40px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                        }}
                    >
                        {/* Abstract Background Visuals */}
                        <div 
                            style={{
                                position: "absolute",
                                width: "240px",
                                height: "240px",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(13,110,253,0.15) 0%, rgba(0,0,0,0) 70%)",
                                top: "-40px",
                                right: "-40px",
                                pointerEvents: "none"
                            }}
                        />
                        <div 
                            style={{
                                position: "absolute",
                                width: "300px",
                                height: "300px",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(13,110,253,0.1) 0%, rgba(0,0,0,0) 70%)",
                                bottom: "-80px",
                                right: "-20px",
                                pointerEvents: "none"
                            }}
                        />

                        <div>
                            <span 
                                className="badge bg-primary mb-3 px-3 py-2 text-uppercase fw-bold"
                                style={{ fontSize: "12px", letterSpacing: "1px" }}
                            >
                                Limited Time Offer
                            </span>
                            <h2 className="fw-bold mb-3" style={{ fontSize: "36px", lineHeight: "1.2" }}>
                                Smart Living,<br />Clearance Sale!
                            </h2>
                            <p className="text-secondary mb-4" style={{ fontSize: "16px", maxWidth: "420px" }}>
                                Upgrade your home and workspace with premium electronics at up to 60% off. Flat discounts apply today.
                            </p>
                            <div>
                                <button 
                                    className="btn btn-primary btn-lg px-4 py-2 fw-semibold border-0"
                                    style={{
                                        borderRadius: "8px",
                                        fontSize: "15px",
                                        boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)"
                                    }}
                                >
                                    Explore Deals
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Features Cards */}
                <div className="col-12 col-lg-6">
                    <div className="row g-4">
                        {features.map((feat, index) => (
                            <div key={index} className="col-12 col-sm-6">
                                <div 
                                    className="p-4 h-100"
                                    style={{
                                        borderRadius: "14px",
                                        border: "1px solid #f1f5f9",
                                        backgroundColor: "#f8fafc",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    <div 
                                        className="mb-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "56px",
                                            height: "56px",
                                            borderRadius: "10px",
                                            backgroundColor: "#eff6ff"
                                        }}
                                    >
                                        {feat.icon}
                                    </div>
                                    <h5 className="fw-bold mb-2" style={{ fontSize: "16px", color: "#1e293b" }}>
                                        {feat.title}
                                    </h5>
                                    <p className="text-muted mb-0" style={{ fontSize: "13px", lineHeight: "1.4" }}>
                                        {feat.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
     );
}

export default Interesting;