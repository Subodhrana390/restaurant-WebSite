import asyncHandler from "../../utils/asyncHandler.js";
import { EmployeeModel } from "../../../Database/models/employee.model.js";
import { AppError } from "../../utils/AppError.js";
import ApiResponse from "../../utils/ApiResponse.js";

// Get Employee by ID
const getEmployeeById = asyncHandler(async (req, res, next) => {
  const employee = await EmployeeModel.findById(req.params.id).select("-password");
  if (!employee) {
    return next(new AppError(404, "Employee not found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, employee, "Employee fetched successfully"));
});

const getEmployeeProfile = asyncHandler(async (req, res, next) => {
  const employee = await EmployeeModel.findById(req.user._id).select("-password");
  if (!employee) {
    return next(new AppError(404, "Employee not found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, employee, "Employee fetched successfully"));
});

const getAllEmployees = asyncHandler(async (req, res, next) => {
  const { cursor, limit = 10 } = req.query;
  const pageSize = parseInt(limit, 10) || 10;

  let query = {};
  if (cursor) {
    query._id = { $gt: cursor }; // Fetch employees after the cursor
  }

  const employees = await EmployeeModel.find(query)
    .sort({ _id: 1 }) // Ensuring consistent order
    .limit(pageSize)
    .select("-password");

  if (!employees.length) {
    throw new AppError(404, "No employees found");
  }

  // Determine next cursor if more documents exist
  const nextCursor = employees.length === pageSize ? employees[employees.length - 1]._id : null;

  res.status(200).json(
    new ApiResponse(200, { employees, nextCursor }, "Employees fetched successfully")
  );
});

// Update Employee by ID
const updateEmployeeById = asyncHandler(async (req, res, next) => {
  const {
    name,
    phone,
    role,
    salary,
    shift,
    address, // Expected to be an object with street, city, state, pinCode, country
    status,
  } = req.body;

  let profile;
  if (req.file) {
    profile = req.file.filename;
  }

  const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      phone,
      role,
      salary,
      shift,
      address,
      status,
      profileImage: profile,
    },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedEmployee) {
    return next(new AppError(404, "Employee not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedEmployee, "Employee updated successfully"));
});

// Delete Employee
const deleteEmployee = asyncHandler(async (req, res, next) => {
  const employee = await EmployeeModel.findByIdAndDelete(req.params.id);
  if (!employee) {
    return next(new AppError(404, "Employee not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Employee deleted successfully"));
});

export { deleteEmployee, getAllEmployees, updateEmployeeById, getEmployeeById,getEmployeeProfile };
