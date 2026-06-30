const mongoose = require("mongoose");
const Product = require("../model/Product");
const defaultProducts = require("./seedProducts");

const seedProducts = async () => {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log("Seeding default products into MongoDB...");
    try {
      await Product.insertMany(defaultProducts, { ordered: false });
      console.log("Default products seeded successfully!");
    } catch (seedError) {
      if (seedError.code === 11000 || seedError.message.includes("E11000")) {
        console.log("Seeding skipped: Products already seeded.");
      } else {
        throw seedError;
      }
    }
  }
};

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 4000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedProducts();
  } catch (error) {
    console.error("MongoDB Atlas Connection Error:", error.message);
    console.log("Attempting fallback to local MongoDB...");
    try {
      const conn = await mongoose.connect("mongodb://127.0.0.1:27017/zonda", {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
      await seedProducts();
    } catch (localError) {
      console.error("Local MongoDB Fallback Connection Error:", localError.message);
      // Throw the original Atlas error to be caught by health-check
      throw error;
    }
  }
};

module.exports = connectDB;