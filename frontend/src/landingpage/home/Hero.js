import React, { useState, useEffect } from 'react';

function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            id: 1,
            badge: "Gaming Powerhouse",
            title: "Lenovo Legion Pro 5",
            desc: "Unleash next-gen performance with AMD Ryzen 7, NVIDIA RTX 4060, and a stunning 165Hz QHD gaming display. Engineered for victory.",
            price: "₹1,44,999",
            originalPrice: "₹1,69,999",
            src: "media/legion.webp",
            bg: "linear-gradient(135deg, #0b0f19 0%, #1e1b4b 100%)",
            badgeBg: "#ef4444",
            btnText: "Explore Legion"
        },
        {
            id: 2,
            badge: "Galaxy AI is Here",
            title: "Samsung Galaxy S24 Ultra",
            desc: "Experience the next era of mobile technology. Zoom into the dark with Nightography, search instantly with Circle to Search, and note smarter.",
            price: "₹1,24,999",
            originalPrice: "₹1,39,999",
            src: "media/sam.webp",
            bg: "linear-gradient(135deg, #0a1128 0%, #0c4a6e 100%)",
            badgeBg: "#3b82f6",
            btnText: "Pre-order Now"
        },
        {
            id: 3,
            badge: "Zonda Exclusive",
            title: "Zonda Luxury Perfume",
            desc: "An exquisite French fragrance elixir blending cedarwood, warm amber, and citrus notes. Crafted for the sophisticated modern individual.",
            price: "₹1,499",
            originalPrice: "₹2,499",
            src: "media/per.webp",
            bg: "linear-gradient(135deg, #180c0c 0%, #451a03 100%)",
            badgeBg: "#10b981",
            btnText: "Shop Fragrance"
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    // Auto-slide effect every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <div className='container my-5 position-relative px-3'>
            <div className='overflow-hidden rounded-4 shadow-lg'>
                <div 
                    className='d-flex'
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    {slides.map((slide) => (
                        <div 
                            key={slide.id} 
                            style={{ 
                                flex: '0 0 100%',
                                background: slide.bg,
                                overflow: 'hidden'
                            }}
                        >
                            <div className="row align-items-center justify-content-between p-4 p-md-5 min-vh-50">
                                {/* Left Side: Copy and Buttons */}
                                <div className="col-12 col-md-7 text-white mb-4 mb-md-0 order-2 order-md-1">
                                    <span 
                                        className="badge px-3 py-2 text-uppercase fw-bold mb-3 d-inline-block"
                                        style={{ 
                                            backgroundColor: slide.badgeBg, 
                                            fontSize: "11px", 
                                            letterSpacing: "1px",
                                            borderRadius: "6px" 
                                        }}
                                    >
                                        {slide.badge}
                                    </span>
                                    <h1 className="fw-extrabold mb-3 display-4" style={{ fontWeight: 800, lineHeight: "1.1" }}>
                                        {slide.title}
                                    </h1>
                                    <p className="mb-4 text-light-emphasis" style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: "1.6", maxWidth: "500px" }}>
                                        {slide.desc}
                                    </p>
                                    <div className="d-flex align-items-baseline gap-3 mb-4">
                                        <span className="fs-2 fw-bold text-white">{slide.price}</span>
                                        <span className="text-decoration-line-through text-muted" style={{ fontSize: "14px" }}>{slide.originalPrice}</span>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <button 
                                            className="btn btn-primary px-4 py-2.5 fw-semibold border-0"
                                            style={{
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                boxShadow: `0 4px 14px ${slide.badgeBg}40`,
                                                backgroundColor: slide.badgeBg
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.filter = "brightness(1.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.filter = "brightness(1)";
                                            }}
                                        >
                                            {slide.btnText}
                                        </button>
                                        <button 
                                            className="btn btn-outline-light px-4 py-2.5 fw-semibold"
                                            style={{
                                                borderRadius: "8px",
                                                fontSize: "14px"
                                            }}
                                        >
                                            Learn More
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side: Floating Product Image */}
                                <div className="col-12 col-md-5 d-flex justify-content-center align-items-center order-1 order-md-2 mb-4 mb-md-0">
                                    <div 
                                        className="animate-float d-flex justify-content-center align-items-center" 
                                        style={{ 
                                            position: "relative", 
                                            width: "100%", 
                                            height: "260px",
                                        }}
                                    >
                                        <img 
                                            src={slide.src} 
                                            alt={slide.title} 
                                            style={{ 
                                                maxWidth: "85%", 
                                                maxHeight: "85%", 
                                                objectFit: "contain",
                                                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.45))"
                                            }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button 
                onClick={prevSlide}
                className="btn position-absolute top-50 start-0 translate-middle-y shadow-sm rounded-circle d-none d-md-flex align-items-center justify-content-center"
                style={{ 
                    width: '46px', 
                    height: '46px', 
                    zIndex: 10, 
                    border: '1px solid rgba(255,255,255,0.1)',
                    left: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>
            <button 
                onClick={nextSlide}
                className="btn position-absolute top-50 end-0 translate-middle-y shadow-sm rounded-circle d-none d-md-flex align-items-center justify-content-center"
                style={{ 
                    width: '46px', 
                    height: '46px', 
                    zIndex: 10, 
                    border: '1px solid rgba(255,255,255,0.1)',
                    right: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>

            {/* Indicator Dots */}
            <div className="d-flex justify-content-center mt-3 gap-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className="border-0"
                        style={{
                            width: currentIndex === idx ? '24px' : '8px',
                            height: '8px',
                            backgroundColor: currentIndex === idx ? '#0d6efd' : '#cbd5e1',
                            transition: 'width 0.3s ease, background-color 0.3s ease',
                            borderRadius: '4px',
                            padding: 0
                        }}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
     );
}

export default Hero;