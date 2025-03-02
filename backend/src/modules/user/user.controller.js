import { UserModel } from "../../../Database/models/user.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import ApiResponse from "../../utils/ApiResponse.js";

// Get user by ID
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (!user) {
    return next(new AppError(404, "User not found"));
  }
  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

const getUserProfile = asyncHandler(async (req, res, next) => {
  console.log(req.user.id)
  const user = await UserModel.findById(req.user.id).select(
    "-password -refreshTokens"
  );
  if (!user) {
    return next(new AppError(404, "User not found"));
  }
  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// Get all users
const getAllUsers = asyncHandler(async (req, res, next) => {
  const { cursor, limit = 10 } = req.query;
  const pageSize = parseInt(limit, 10) || 10;

  // Build query with cursor if provided
  let query = {};
  if (cursor) {
    query._id = { $gt: cursor };
  }

  // Fetch users sorted by _id in ascending order
  const users = await UserModel.find(query)
    .sort({ _id: 1 })
    .limit(pageSize)
    .select("-password");

  if (!users || users.length === 0) {
    return next(new AppError(404, "No users found"));
  }

  // Determine the next cursor (if available)
  const nextCursor =
    users.length === pageSize ? users[users.length - 1]._id : null;

  res
    .status(200)
    .json(
      new ApiResponse(200, { users, nextCursor }, "Users fetched successfully")
    );
});

// Update user by ID
const updateUserById = asyncHandler(async (req, res, next) => {
  const { name, phone, address } = req.body;
  let profile;

  // If a new file is uploaded, use its filename; otherwise, keep it undefined
  if (req.file) {
    profile = req.file.filename;
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      phone,
      address, // Assuming address is an object: { street, city, state, pinCode, country }
      profileImage: profile,
    },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    return next(new AppError(404, "User not found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Change user's password
const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new AppError(400, "Incorrect old password"));
  }

  user.password = newPassword;
  await user.save();
  res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});

// Delete user
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError(404, "User not found"));
  }
  res.status(200).json(new ApiResponse(200, user, "User deleted successfully"));
});

export {
  getUserById,
  getAllUsers,
  getUserProfile,
  changePassword,
  updateUserById,
  deleteUser,
};
