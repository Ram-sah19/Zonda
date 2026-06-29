const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
    },
    src: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    addressLine1: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
    },
    country: {
      type: String,
      default: "India",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentDetails: {
      paymentMethod: {
        type: String,
        default: "Cash on Delivery",
      },
      paymentStatus: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Paid", "Failed"],
      },
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      GST: {
        type: Number,
        required: true,
      },
      shippingCharges: {
        type: Number,
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
    },
    orderStatus: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
