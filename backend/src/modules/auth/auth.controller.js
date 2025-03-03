import { UserModel } from "../../../Database/models/user.model.js";
import { EmployeeModel } from "../../../Database/models/employee.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import jwt, { decode } from "jsonwebtoken";
import ApiResponse from "../../utils/ApiResponse.js";

// Create User
const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address, role } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new AppError(400, "User already exists");

  const newUser = new UserModel({
    name,
    email,
    password,
    phone,
    address,
    role: "customer",
    profileImage,
  });

  await newUser.save();

  res.status(201).json(new ApiResponse(201, null, "User created successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError(404, "User not found");

  if (!user.isActive)
    throw new AppError(403, "Account is inactive. Please contact support.");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError(400, "Invalid credentials");

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json(new ApiResponse(200, { accessToken }, "Login successful"));
});

// Create Employee
const createEmployee = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, role, salary, shift, address } =
    req.body;
  const profileImage = req.file ? req.file.filename : null;
  const existingEmployee = await EmployeeModel.findOne({ email });
  if (existingEmployee) throw new AppError(400, "Employee already exists");

  const newEmployee = new EmployeeModel({
    name,
    email,
    password,
    phone,
    role,
    salary,
    shift,
    address,
    profileImage,
  });

  await newEmployee.save();

  res
    .status(201)
    .json(new ApiResponse(201, null, "Employee created successfully"));
});

// Login Employee
const loginEmployee = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const employee = await EmployeeModel.findOne({ email });
  if (!employee) throw new AppError(404, "Employee not found");

  if (employee.status !== "active")
    throw new AppError(403, "Employee is not active");

  const isMatch = await employee.comparePassword(password);
  if (!isMatch) throw new AppError(400, "Invalid credentials");

  const roles = ["admin", "manager", "chef", "waiter", "cashier", "delivery"];
  if (!roles.includes(employee.role))
    throw new AppError(400, "Employee is not authorized to login");

  const accessToken = jwt.sign(
    { id: employee._id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json(new ApiResponse(200, { accessToken }, "Login successful"));
});


const protectedRoutes = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Token was not provided!"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError(401, "Invalid token format!"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === "customer") {
      user = await UserModel.findById(decoded.id);
    } else if (
      ["admin", "manager", "chef", "waiter", "cashier", "delivery"].includes(
        decoded.role
      )
    ) {
      user = await EmployeeModel.findById(decoded.id);
    } else {
      return next(new AppError(401, "Invalid role in token!"));
    }

    if (!user) {
      return next(new AppError(404, "User not found!"));
    }

    req.user = user;

    next();
  } catch (err) {
    // Handle token verification errors
    if (err.name === "JsonWebTokenError") {
      return next(new AppError(401, "Invalid token!"));
    } else if (err.name === "TokenExpiredError") {
      return next(new AppError(401, "Token has expired! Please log in again."));
    } else {
      return next(
        new AppError(500, "Something went wrong with token verification")
      );
    }
  }
});


const allowedTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          `Access denied. You do not have permission to perform this action. Required roles: ${roles.join(
            ", "
          )}. Your role: ${req.user.role}`
        )
      );
    }
    
    next();
  });
};


const refreshTokenHandler = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError(401, "Refresh token is required");

  try {
    // Verify the provided refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Fetch the user from the database
    const user = await UserModel.findById(decoded.id);
    if (!user) throw new AppError(404, "User not found");

    // Check if the refresh token exists in the user's refreshTokens array
    if (!user.refreshTokens.includes(refreshToken)) {
      throw new AppError(401, "Invalid refresh token");
    }

    // Remove the old refresh token (invalidate it)
    await user.removeRefreshToken(refreshToken);

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const newRefreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Store the new refresh token
    await user.addRefreshToken(newRefreshToken);

    res.json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken, refreshToken: newRefreshToken },
        "Token refreshed successfully"
      )
    );
  } catch (error) {
    return next(new AppError(401, "Invalid or expired refresh token"));
  }
});

export {
  createUser,
  loginUser,
  createEmployee,
  loginEmployee,
  protectedRoutes,
  allowedTo,
  refreshTokenHandler,
};
