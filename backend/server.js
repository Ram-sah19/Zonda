const cluster = require("cluster");
const os = require("os");

const useClustering = process.env.NODE_ENV === "production";

if (useClustering && cluster.isMaster) {
  const numCPUs = Math.min(os.cpus().length, 2);
  console.log(`Master process ${process.pid} is running. Forking ${numCPUs} workers...`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Forking a new worker...`);
    cluster.fork();
  });
} else {
  require("dotenv").config();

  const dns = require("dns");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  const express = require("express");
  const cors = require("cors");

  const connectDB = require("./config/db");

  const app = express();

  // Middleware to check database connection status
  app.use((req, res, next) => {
    const mongoose = require("mongoose");
    // 0 = disconnected, 3 = disconnecting
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
      return res.status(503).json({
        message: "Database connection is offline. The backend failed to connect to MongoDB Atlas. Please verify that your current IP address is whitelisted in MongoDB Atlas Network Access and outbound port 27017 is open.",
        status: "database_offline"
      });
    }
    next();
  });

  app.use(cors());
  app.use(express.json());

  // Routes
  const authRoutes = require("./routes/authRoutes");
  const cartRoutes = require("./routes/cartRoutes");
  const orderRoutes = require("./routes/orderRoutes");
  const productRoutes = require("./routes/productRoutes");
  const adminRoutes = require("./routes/adminRoutes");
  const deliveryRoutes = require("./routes/deliveryRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/delivery", deliveryRoutes);

  app.get("/", (req, res) => {
      res.send(`API Running on Worker ${process.pid}`);
  });

  const PORT = process.env.PORT || 5000;

  // Start the server immediately so it never yields ERR_CONNECTION_REFUSED
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started. Server running on port ${PORT}`);
  });

  // Connect to DB in the background
  connectDB().catch((err) => {
    console.error(`Worker ${process.pid} database connection failed:`, err.message);
  });
}