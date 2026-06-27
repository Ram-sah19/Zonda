import React from 'react';

function Suggest() {
    const recommendations = [
        {
            id: 1,
            name: "Samsung Galaxy S24 Ultra",
            price: "₹1,24,999",
            originalPrice: "₹1,39,999",
            src: "media/sam.webp",
            tag: "Best Match"
        },
        {
            id: 2,
            name: "Lenovo Legion Pro 5",
            price: "₹1,44,999",
            originalPrice: "₹1,69,999",
            src: "media/legion.webp",
            tag: "High Rated"
        },
        {
            id: 3,
            name: "Buds Pro Gen 2",
            price: "₹999",
            originalPrice: "₹1,999",
            src: "media/bud.webp",
            tag: "Top Choice"
        },
        {
            id: 4,
            name: "Plex Smart Watch Active",
            price: "₹2,499",
            originalPrice: "₹4,999",
            src: "media/plex.webp",
            tag: "New Product"
        }
    ];

    return ( 
        <div className="container my-5 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ fontSize: "28px", color: "#0f172a" }}>Recommended For You</h2>
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>Based on your interest in electronics and accessories</p>
                </div>
                <button className="btn btn-link text-decoration-none fw-bold p-0" style={{ color: "#0d6efd", fontSize: "14px" }}>
                    See All Recommendations &rarr;
                </button>
            </div>

            <div className="row g-4">
                {recommendations.map((rec) => (
                    <div key={rec.id} className="col-12 col-sm-6 col-md-3">
                        <div 
                            style={{
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                backgroundColor: "#ffffff",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                height: "290px",
                                position: "relative",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.01)",
                                transition: "all 0.3s ease",
                                cursor: "pointer"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.06)";
                                e.currentTarget.style.borderColor = "#0d6efd";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.01)";
                                e.currentTarget.style.borderColor = "#e2e8f0";
                            }}
                        >
                            {/* Tag */}
                            <span 
                                className="position-absolute badge bg-dark"
                                style={{
                                    top: "10px",
                                    left: "10px",
                                    fontSize: "10px",
                                    fontWeight: "600",
                                    padding: "4px 8px",
                                    zIndex: 1
                                }}
                            >
                                {rec.tag}
                            </span>

                            {/* Image Container */}
                            <div 
                                style={{
                                    height: "150px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#f8fafc",
                                    padding: "12px",
                                    borderBottom: "1px solid #f1f5f9"
                                }}
                            >
                                <img 
                                    src={rec.src} 
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain"
                                    }} 
                                    alt={rec.name}
                                />
                            </div>

                            {/* Product Info */}
                            <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                                <h6 
                                    style={{ 
                                        fontSize: "14px", 
                                        fontWeight: "bold", 
                                        color: "#1e293b",
                                        margin: "0 0 6px 0",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}
                                >
                                    {rec.name}
                                </h6>
                                
                                <div>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "10px" }}>
                                        <span style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>{rec.price}</span>
                                        <span style={{ fontSize: "11px", textDecoration: "line-through", color: "#94a3b8" }}>{rec.originalPrice}</span>
                                    </div>
                                    <button 
                                        className="btn btn-outline-dark btn-sm w-100 py-2"
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            borderRadius: "6px",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
     );
}

export default Suggest;