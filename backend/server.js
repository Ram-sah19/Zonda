const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master process ${process.pid} is running. Forking ${numCPUs} workers for load balancing...`);
  
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

  connectDB();

  app.use(cors());
  app.use(express.json());

  // Routes
  const authRoutes = require("./routes/authRoutes");
  const cartRoutes = require("./routes/cartRoutes");
  const orderRoutes = require("./routes/orderRoutes");
  const productRoutes = require("./routes/productRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/products", productRoutes);

  app.get("/", (req, res) => {
      res.send(`API Running on Worker ${process.pid}`);
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
      console.log(`Worker ${process.pid} started. Server running on port ${PORT}`);
  });
}