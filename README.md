# Zonda — Full-Stack E-Commerce Application

Zonda is a modern, high-performance, full-stack e-commerce web application built using **React** for the user interface and **Express / Node.js** for the backend API, powered by **MongoDB** for data persistence.

---

## 📁 Project Structure

The project is structured into two main workspaces:

```text
zonda/
├── backend/          # Express.js REST API & Database Models
│   ├── config/       # Database connection configs
│   ├── .env          # Server environment configurations
│   ├── server.js     # API entry point
│   └── package.json  # Node dependencies & scripts
│
└── frontend/         # React.js SPA (Single Page Application)
    ├── public/       # Static assets (HTML template, media files)
    ├── src/          # React components, styles, & state logic
    │   ├── landingpage/
    │   │   ├── home/
    │   │   │   ├── Hero.js   # Banner Slider/Carousel
    │   │   │   └── Brand.js  # Brands Spotlight Grid
    │   │   └── Navbar.js
    │   └── index.css # Global stylesheets & micro-animations
    └── package.json  # Frontend scripts & dependencies
```

---

## ✨ Features Spotlight

### 1. Auto-Sliding Banner Hero (`Hero.js`)
* **Responsive Multi-Item View**: Displays 3 banner images at a time on desktop, 2 on tablets, and wraps to 1 banner on mobile screens.
* **Uniform Layout Aspect Ratios**: All banners share the exact same height and width, and use `object-fit: cover` to avoid image squishing or distortion.
* **Smooth Animations**: Animated sliding transition powered by cubic-bezier transforms.
* **Smart Navigation**: Includes custom-styled next/prev arrow buttons and responsive pill-shaped indicators at the bottom.
* **Auto-Play**: Automatically cycles through images every 5 seconds.

### 2. Spotlight Brands Grid (`Brand.js`)
* **Rectangle Brand Cards**: Clean rectangular cards with subtle border outlines and soft shadows.
* **Grouped 3-by-3 Grid Layout**: Brands are arranged in a structured layout of 3 columns per row (creating two balanced rows of 3 on desktop), scaling beautifully down to smaller viewports.
* **Full-Cover Image Headers**: Image containers are optimized to stretch promo banners (`object-fit: cover`) to fill the header bounds cleanly without border gaps.
* **Rich Card Content**: Displays comprehensive card details (Brand Name, Sub-Description, Selling Price, Original Price, and Green Discount badge).
* **Self-Contained Micro-Animations**: Interactive hover styling (translate y-axis lift, border highlight, and box-shadow depth increase) written directly using inline React handlers to keep card components independent.

### 3. Dynamic Product Catalog (`Feature.js`)
* **10-Category Filter Bar**: Dynamic horizontal scroll pill list that filters products in real-time (Smartphones, Laptops, Audio, Smartwatches, TVs, Gaming, Home Appliances, Cameras, Accessories, Monitors, plus an "All Products" option).
* **Complete Product Cards**: Includes detailed product pricing (current price vs. original strikethrough price), ratings (rendered dynamically using SVG star arrays), and eye-catching tags ("Best Seller", "50% OFF", etc.).
* **Advanced Visual Effects**: Card hover lifts alongside secondary image-zoom transitions.
* **Clean Fallbacks**: Includes high-resolution imagery links and local catalog mappings so it works instantly with zero broken links.

### 4. Promotion & Brand Benefits Showcase (`Interesting.js`)
* **Split Layout**: Left side contains an attention-grabbing, dark-themed gradient promo banner card for limited-time clearance deals. Right side displays a grid of four brand benefit highlights.
* **Benefit Metrics**: Standard e-commerce selling points (Free Fast Delivery, Secure Payments, Easy Returns, 24/7 Dedicated Support) with customized, sleek SVG vector icons.

### 5. Recommendation System (`Suggest.js`)
* **Personalized Product Feed**: Suggests products related to user interest in real-time.
* **Compact Cards**: Shorter cards with quick "Add to Cart" CTA buttons, visual match labels (e.g. "Best Match", "High Rated"), and hover-lift transformations.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, React Router v7, Bootstrap 5 (CDN), Vanilla CSS3.
* **Backend**: Node.js, Express.js (v5), Mongoose, MongoDB Atlas.
* **Security & Utility**: JSON Web Tokens (JWT), Bcrypt, CORS, Cookie-Parser, Dotenv.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+ recommended)
* **npm** (v9+ recommended)
* **MongoDB Atlas** account (or local MongoDB database instance)

---

### Setup Instructions

#### 1. Setup the Backend Server
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `/backend` folder and define your database credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   ```
4. Start the backend dev server:
   ```bash
   npm run dev
   ```
   *(Runs on http://localhost:5000)*

---

#### 2. Setup the Frontend Client
1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *(Launches the app on http://localhost:3000)*
