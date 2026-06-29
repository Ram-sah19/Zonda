const mongoose = require("mongoose");
const Product = require("../model/Product");
const defaultProducts = require("./seedProducts");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("Seeding default products into MongoDB...");
      try {
        await Product.insertMany(defaultProducts, { ordered: false });
        console.log("Default products seeded successfully!");
      } catch (seedError) {
        if (seedError.code === 11000 || seedError.message.includes("E11000")) {
          console.log("Seeding skipped: Products already seeded by another worker.");
        } else {
          throw seedError;
        }
      }
    }
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;