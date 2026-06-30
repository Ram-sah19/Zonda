const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    adminRole: {
      type: String,
      enum: ["Super Admin", "Manager", "Moderator", "Support"],
      default: null,
    },
    sellerStatus: {
      type: String,
      enum: ["None", "Pending", "Approved", "Suspended"],
      default: "None",
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    isDeliveryPartner: {
      type: Boolean,
      default: false,
    },
    deliveryPartnerStatus: {
      type: String,
      enum: ["None", "Pending", "Approved", "Suspended"],
      default: "None",
    },
    deliveryPartnerDetails: {
      vehicleType: {
        type: String,
        enum: ["bike", "car", "van", "truck"],
        default: "bike",
      },
      vehicleNumber: {
        type: String,
        trim: true,
      },
      licenseNumber: {
        type: String,
        trim: true,
      },
      idDocuments: {
        docType: {
          type: String,
          trim: true,
        },
        docNumber: {
          type: String,
          trim: true,
        },
      },
      earnings: {
        daily: { type: Number, default: 0 },
        weekly: { type: Number, default: 0 },
        monthly: { type: Number, default: 0 },
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
      location: {
        lat: { type: Number, default: 12.9716 },
        lng: { type: Number, default: 77.5946 },
      },
    },
    sellerDetails: {
      businessName: {
        type: String,
        trim: true,
      },
      businessContact: {
        type: String,
        trim: true,
      },
      businessAddress: {
        type: String,
        trim: true,
      },
      taxId: {
        type: String,
        trim: true,
      },
      bankInfo: {
        accountNumber: { type: String, trim: true },
        ifscCode: { type: String, trim: true },
        bankName: { type: String, trim: true },
      },
      idVerification: {
        docType: { type: String, trim: true },
        docNumber: { type: String, trim: true },
        docUrl: { type: String, trim: true },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
