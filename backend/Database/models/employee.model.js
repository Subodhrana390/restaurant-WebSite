import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Employee Name
    email: { type: String, required: true, unique: true }, // Login Email
    password: { type: String, required: true }, // Hashed Password
    phone: { type: String, required: true }, // Contact Number
    role: {
      type: String,
      enum: ["admin", "manager", "chef", "waiter", "cashier", "delivery"],
      required: true,
    }, // Employee Role
    salary: { type: Number, default: 0 }, // Salary of the employee
    shift: {
      type: String,
      enum: ["morning", "evening", "night"],
      required: true,
    }, // Assigned Shift
    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    }, // Employment Status
    address: {
      street: String,
      city: String,
      state: String,
      pinCode: String,
      country: String,
    }, // Address of Employee
    dateOfJoining: { type: Date, default: Date.now }, // Joining Date
    profileImage: { type: String, default: null }, // Profile Picture URL
  },
  { timestamps: true }
);

// Hash password before saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
employeeSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const EmployeeModel = mongoose.model("Employee", employeeSchema);
