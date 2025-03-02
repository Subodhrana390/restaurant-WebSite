import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      default: "customer",
    },
    address: {
      street: String,
      city: String,
      state: String,
      pinCode: String,
      country: String,
    },
    profileImage: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    // New field to store refresh tokens (you can store multiple tokens if needed)
    refreshTokens: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to add a refresh token to the user's token store
userSchema.methods.addRefreshToken = async function (token) {
  this.refreshTokens.push(token);
  await this.save();
  return token;
};

// Method to remove a specific refresh token from the user's token store
userSchema.methods.removeRefreshToken = async function (token) {
  this.refreshTokens = this.refreshTokens.filter((t) => t !== token);
  await this.save();
  return true;
};

export const UserModel = mongoose.model("User", userSchema);
