import React from 'react';
import { useNavigate } from 'react-router-dom';

function Features({ activeCategory }) {
    const navigate = useNavigate();

    const categories = [
        { id: 'all', name: 'All Products', icon: '⚡' },
        { id: 'smartphones', name: 'Smartphones', icon: '📱' },
        { id: 'laptops', name: 'Laptops', icon: '💻' },
        { id: 'audio', name: 'Audio & Headphones', icon: '🎧' },
        { id: 'smartwatches', name: 'Smartwatches', icon: '⌚' },
        { id: 'tvs', name: 'TVs', icon: '📺' },
        { id: 'gaming', name: 'Gaming', icon: '🎮' },
        { id: 'appliances', name: 'Home Appliances', icon: '🏠' },
        { id: 'cameras', name: 'Cameras', icon: '📷' },
        { id: 'accessories', name: 'Accessories', icon: '⌨️' },
        { id: 'monitors', name: 'Monitors', icon: '🖥️' }
    ];

    const products = [
        {
            id: 1,
            category: 'smartphones',
            name: 'Samsung Galaxy S24 Ultra',
            desc: '5G, 256GB Storage, AI Camera & S-Pen included',
            price: '₹1,24,999',
            originalPrice: '₹1,39,999',
            rating: 5,
            src: 'media/sam.webp',
            badge: 'Best Seller'
        },
        {
            id: 2,
            category: 'smartphones',
            name: 'Nova 2 Neo 5G',
            desc: '6000mAh Battery, 48MP Dual Sony Camera',
            price: '₹12,999',
            originalPrice: '₹17,999',
            rating: 4,
            src: 'media/-original-imahgeusscuw8ezf.webp',
            badge: 'Special Deal'
        },
        {
            id: 3,
            category: 'laptops',
            name: 'Lenovo Legion Pro 5',
            desc: 'AMD Ryzen 7, RTX 4060, 16GB RAM, 1TB SSD',
            price: '₹1,44,999',
            originalPrice: '₹1,69,999',
            rating: 5,
            src: 'media/legion.webp',
            badge: 'Gaming'
        },
        {
            id: 4,
            category: 'laptops',
            name: 'Lenovo ThinkPad E14',
            desc: 'Intel Core i5, 8GB RAM, 512GB SSD, Windows 11',
            price: '₹56,999',
            originalPrice: '₹72,000',
            rating: 4,
            src: 'media/lenvo.webp',
            badge: 'Business'
        },
        {
            id: 5,
            category: 'audio',
            name: 'Mivi Soundbar 100W',
            desc: 'Deep Bass Home Theater, 2.1 Channel Cinema Sound',
            price: '₹3,999',
            originalPrice: '₹7,999',
            rating: 4,
            src: 'media/mivi.webp',
            badge: '50% OFF'
        },
        {
            id: 6,
            category: 'audio',
            name: 'Buds Pro Gen 2',
            desc: 'Active Noise Cancellation, 40 Hours Playback',
            price: '₹999',
            originalPrice: '₹1,999',
            rating: 4,
            src: 'media/bud.webp',
            badge: 'Trending'
        },
        {
            id: 7,
            category: 'audio',
            name: 'Ex Wireless ANC Earbuds',
            desc: 'True Wireless Audio with Smart Touch controls',
            price: '₹1,299',
            originalPrice: '₹2,999',
            rating: 4,
            src: 'media/ex.webp',
            badge: 'Popular'
        },
        {
            id: 8,
            category: 'smartwatches',
            name: 'Plex Smart Watch Active',
            desc: 'Heart rate tracker, SpO2 sensor, Sleep analytics',
            price: '₹2,499',
            originalPrice: '₹4,999',
            rating: 5,
            src: 'media/plex.webp',
            badge: 'New Launch'
        },
        {
            id: 9,
            category: 'tvs',
            name: 'Sony Bravia 55" 4K Smart TV',
            desc: 'Google TV, Dolby Vision HDR, X1 Processor',
            price: '₹57,999',
            originalPrice: '₹74,900',
            rating: 5,
            src: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=60',
            badge: '4K Ultra'
        },
        {
            id: 10,
            category: 'gaming',
            name: 'PlayStation 5 Console Slim',
            desc: '825GB SSD, DualSense Wireless Controller',
            price: '₹44,990',
            originalPrice: '₹54,990',
            rating: 5,
            src: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=60',
            badge: 'Hot Seller'
        },
        {
            id: 11,
            category: 'appliances',
            name: 'Dyson V15 Vacuum Cleaner',
            desc: 'Laser dust detection, High torque cleaner head',
            price: '₹65,900',
            originalPrice: '₹72,900',
            rating: 4,
            src: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=60',
            badge: 'Premium'
        },
        {
            id: 12,
            category: 'cameras',
            name: 'Sony Alpha 7 IV Mirrorless',
            desc: '33MP Full-Frame sensor, 4K 60p video recording',
            price: '₹2,18,990',
            originalPrice: '₹2,42,900',
            rating: 5,
            src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
            badge: 'Pro Choice'
        },
        {
            id: 13,
            category: 'accessories',
            name: 'Logitech MX Master 3S Mouse',
            desc: 'Ergonomic silent mouse, 8K DPI tracking',
            price: '₹9,495',
            originalPrice: '₹10,995',
            rating: 5,
            src: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60',
            badge: 'Workplace'
        },
        {
            id: 14,
            category: 'monitors',
            name: 'Zonda UltraWide 34" Curved',
            desc: 'WQHD Display, 144Hz refresh rate, HDR10',
            price: '₹29,999',
            originalPrice: '₹45,000',
            rating: 4,
            src: 'media/tab.webp',
            badge: 'Curved'
        }
    ];

    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(p => p.category === activeCategory);

    return ( 
        <div id="featured-collections" className="container my-5" style={{ scrollMarginTop: "140px" }}>
            {/* Header */}
            <div className="border-bottom pb-3 mb-5">
                <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>Product Catalog</span>
                <h2 className="fw-bold mt-1 mb-2" style={{ fontSize: "30px", color: "#0f172a" }}>
                    Featured Collections{activeCategory !== 'all' && ` — ${categories.find(c => c.id === activeCategory)?.name}`}
                </h2>
                <p className="text-muted mb-0" style={{ fontSize: "15px" }}>Explore top-rated products from our popular categories</p>
            </div>

            {/* Products Grid */}
            <div className="row justify-content-start g-4">
                {filteredProducts.map((prod) => (
                    <div key={prod.id} className='col-12 col-sm-6 col-lg-3 d-flex align-items-stretch'>
                        <div 
                            style={{
                                width: "100%",
                                borderRadius: "12px", 
                                border: "1px solid #e2e8f0",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                cursor: "pointer",
                                position: "relative"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
                                e.currentTarget.style.borderColor = "#0d6efd";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.02)";
                                e.currentTarget.style.borderColor = "#e2e8f0";
                            }}
                        >
                            {/* Promo Badge */}
                            {prod.badge && (
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
                                    {prod.badge}
                                </span>
                            )}

                            {/* Image Container */}
                            <div 
                                style={{
                                    height: "170px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#f8fafc",
                                    padding: "15px",
                                    borderBottom: "1px solid #f1f5f9",
                                    overflow: "hidden"
                                }}
                            >
                                <img 
                                    src={prod.src} 
                                    style={{
                                        maxWidth: "100%", 
                                        maxHeight: "100%", 
                                        objectFit: "contain",
                                        transition: "transform 0.4s ease"
                                    }} 
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                    alt={prod.name} 
                                />
                            </div>

                            {/* Details Container */}
                            <div style={{ padding: "15px", display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-between" }}>
                                <div>
                                    {/* Star Rating */}
                                    <div style={{ display: "flex", gap: "3px", marginBottom: "6px" }}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <i 
                                                key={i} 
                                                className={`bi ${i < prod.rating ? 'bi-star-fill text-warning' : 'bi-star text-black-50'}`}
                                                style={{ fontSize: "12px" }}
                                            ></i>
                                        ))}
                                    </div>

                                    <h5 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 6px 0", color: "#1e293b", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                        {prod.name}
                                    </h5>
                                    <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px 0", lineHeight: "1.4", height: "34px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                        {prod.desc}
                                    </p>
                                </div>
                                
                                <div>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
                                        <span style={{ fontSize: "17px", fontWeight: "bold", color: "#0f172a" }}>{prod.price}</span>
                                        <span style={{ fontSize: "12px", textDecoration: "line-through", color: "#94a3b8" }}>{prod.originalPrice}</span>
                                    </div>

                                    <button 
                                        onClick={() => navigate(`/products/${prod.id}`)}
                                        className="btn btn-outline-primary btn-sm w-100 py-2"
                                        style={{
                                            borderRadius: "6px",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        View Details
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

export default Features;