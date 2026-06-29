import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'smartphones', name: 'Smartphones' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'audio', name: 'Audio & Headphones' },
  { id: 'smartwatches', name: 'Smartwatches' },
  { id: 'tvs', name: 'TVs' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'appliances', name: 'Home Appliances' },
  { id: 'cameras', name: 'Cameras' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'monitors', name: 'Monitors' }
];

// Seed list fallback in case DB is offline
export const products = [
  {
    id: 1,
    category: 'smartphones',
    name: 'Samsung Galaxy S24 Ultra',
    desc: '5G, 256GB Storage, AI Camera & S-Pen included',
    price: 124999,
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
    price: 12999,
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
    price: 144999,
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
    price: 56999,
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
    price: 3999,
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
    price: 999,
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
    price: 1299,
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
    price: 2499,
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
    price: 57999,
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
    price: 44990,
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
    price: 65900,
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
    price: 218990,
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
    price: 9495,
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
    price: 29999,
    originalPrice: '₹45,000',
    rating: 4,
    src: 'media/tab.webp',
    badge: 'Curved'
  }
];

const Productpage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(250000);
  const [sortBy, setSortBy] = useState('featured');
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (response.ok) {
          const data = await response.json();
          setDbProducts(data);
        } else {
          setDbProducts(products);
        }
      } catch (err) {
        console.error("Failed to load products from API:", err);
        setDbProducts(products);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const searchVal = searchParams.get("search") || "";
    setSearchTerm(searchVal);
  }, [searchParams]);

  const [addingId, setAddingId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    const result = await addToCart(product.id, 1);
    setAddingId(null);
    
    if (result.success) {
      setNotification({
        show: true,
        message: `${product.name} added to cart!`,
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } else {
      if (result.error === "Not authenticated" || result.error === "Please log in to add items to your cart.") {
        setNotification({
          show: true,
          message: "Please log in to add items to your cart. Redirecting...",
          type: 'warning'
        });
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
          navigate("/login");
        }, 2000);
      } else {
        setNotification({
          show: true,
          message: result.error || "Failed to add to cart.",
          type: 'danger'
        });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      }
    }
  };

  const filteredProducts = useMemo(() => {
    return dbProducts
      .filter((prod) => {
        const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              prod.desc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
        const matchesPrice = prod.price <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [dbProducts, searchTerm, selectedCategory, priceRange, sortBy]);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {notification.show && (
          <div 
            className={`alert alert-${notification.type} alert-dismissible fade show shadow-sm border-0 d-flex align-items-center gap-2`} 
            role="alert"
            style={{
              position: "fixed",
              top: "90px",
              right: "24px",
              zIndex: 1050,
              minWidth: "300px",
              borderRadius: "12px"
            }}
          >
            <i className={`bi ${notification.type === 'success' ? 'bi-check-circle-fill' : notification.type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-x-circle-fill'}`}></i>
            <div>{notification.message}</div>
            <button 
              type="button" 
              className="btn-close shadow-none" 
              onClick={() => setNotification({ show: false, message: '', type: '' })}
            ></button>
          </div>
        )}
        
        {/* Title Header */}
        <div className="border-bottom pb-3 mb-5">
          <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "12px", letterSpacing: "2px" }}>Browse Collection</span>
          <h2 className="fw-extrabold mt-1 mb-2" style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800" }}>Our Products</h2>
          <p className="text-muted mb-0" style={{ fontSize: "15px" }}>Discover next-generation electronics and premium gadgets with curated quality.</p>
        </div>

        <div className="row g-4">
          
          {/* Sidebar Filters */}
          <div className="col-12 col-lg-3">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white sticky-top" style={{ top: "110px", zIndex: 10 }}>
              
              {/* Category Filter */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3" style={{ fontSize: "16px", color: "#1e293b" }}>Categories</h5>
                <div className="d-flex flex-column gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`btn btn-sm text-start py-2 px-3 border-0 rounded-3 transition-all ${selectedCategory === cat.id ? 'bg-primary text-white fw-semibold' : 'btn-light text-muted'}`}
                      style={{ fontSize: "13px" }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-4 border-top pt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0" style={{ fontSize: "16px", color: "#1e293b" }}>Max Price</h5>
                  <span className="badge bg-light text-primary fw-bold border" style={{ fontSize: "12px" }}>₹{priceRange.toLocaleString("en-IN")}</span>
                </div>
                <input 
                  type="range" 
                  className="form-range" 
                  min="500" 
                  max="250000" 
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: "11px" }}>
                  <span>₹500</span>
                  <span>₹2.5L</span>
                </div>
              </div>

              {/* Reset Button */}
              <button 
                className="btn btn-outline-danger btn-sm w-100 py-2.5 fw-semibold"
                style={{ borderRadius: "8px", fontSize: "13px" }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange(250000);
                  setSortBy('featured');
                  setSearchParams({});
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Product Listing Area */}
          <div className="col-12 col-lg-9">
            
            {/* Toolbar */}
            <div className="card border-0 shadow-sm p-3 mb-4 rounded-4 bg-white">
              <div className="row g-3 align-items-center justify-content-between">
                
                {/* Search Bar */}
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2 border" style={{ borderColor: "#e2e8f0" }}>
                    <i className="bi bi-search text-muted me-2" style={{ fontSize: "14px" }}></i>
                    <input 
                      type="text" 
                      placeholder="Search within page..." 
                      className="border-0 bg-transparent w-100"
                      style={{ fontSize: "13px", outline: "none", color: "#1e293b" }} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Sort Option */}
                <div className="col-12 col-md-4 d-flex align-items-center gap-2 justify-content-md-end">
                  <span className="text-muted flex-shrink-0" style={{ fontSize: "13px" }}>Sort By:</span>
                  <select 
                    className="form-select form-select-sm border rounded-pill px-3 py-2"
                    style={{ fontSize: "13px", cursor: "pointer", outline: "none" }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading products...</span>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="row g-4">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
                    <div 
                      className="card border-0 shadow-sm overflow-hidden w-100 d-flex flex-column justify-content-between"
                      style={{
                        borderRadius: "16px",
                        backgroundColor: "#ffffff",
                        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        cursor: "pointer",
                        position: "relative"
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
                      {/* Badge */}
                      {prod.badge && (
                        <span 
                          className="position-absolute badge rounded-pill bg-danger"
                          style={{
                            top: "12px",
                            left: "12px",
                            fontSize: "10px",
                            fontWeight: "600",
                            padding: "6px 12px",
                            zIndex: 1
                          }}
                        >
                          {prod.badge}
                        </span>
                      )}

                      {/* Image Frame */}
                      <div 
                        onClick={() => navigate(`/products/${prod.id}`)}
                        className="p-4 d-flex justify-content-center align-items-center"
                        style={{
                          backgroundColor: "#f8fafc",
                          height: "170px",
                          borderBottom: "1px solid #f1f5f9"
                        }}
                      >
                        <img 
                          src={prod.src.startsWith("http") || prod.src.startsWith("data:") ? prod.src : `/${prod.src}`} 
                          alt={prod.name} 
                          style={{
                            maxWidth: "80%",
                            maxHeight: "80%",
                            objectFit: "contain"
                          }}
                        />
                      </div>

                      {/* Info Area */}
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
                            <span className="fs-5 fw-bold text-dark">₹{prod.price.toLocaleString("en-IN")}</span>
                            {prod.originalPrice && (
                              <span className="text-muted text-decoration-line-through" style={{ fontSize: "12px" }}>{prod.originalPrice}</span>
                            )}
                          </div>

                          <div className="d-flex gap-2">
                            <button 
                              onClick={() => navigate(`/products/${prod.id}`)}
                              className="btn btn-outline-secondary btn-sm w-50 py-2 fw-semibold"
                              style={{ borderRadius: "8px", fontSize: "13px" }}
                            >
                              Details
                            </button>
                            <button 
                              onClick={() => handleAddToCart(prod)}
                              disabled={addingId === prod.id}
                              className="btn btn-primary btn-sm w-50 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1.5"
                              style={{ borderRadius: "8px", fontSize: "13px" }}
                            >
                              {addingId === prod.id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                  Adding...
                                </>
                              ) : (
                                <>Add to Cart</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card border-0 shadow-sm p-5 text-center rounded-4 bg-white">
                <i className="bi bi-inbox text-muted display-4 mb-3"></i>
                <h4 className="fw-bold text-dark">No products found</h4>
                <p className="text-muted mx-auto mb-0" style={{ maxWidth: "350px" }}>Try tweaking your search keywords or broadening the filters.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Productpage;