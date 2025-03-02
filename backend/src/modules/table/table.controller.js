import { TableModel } from "../../../Database/models/table.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import ApiResponse from "../../utils/ApiResponse.js";

// Create a new table
const createTable = asyncHandler(async (req, res, next) => {
  const { tableNumber } = req.body;

  // Check if a table with the same tableNumber already exists
  const existingTable = await TableModel.findOne({ tableNumber });
  if (existingTable) {
    return next(new AppError(400, "Table number already exists"));
  }

  const newTable = await TableModel.create(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, newTable, "Table created successfully"));
});

// Get all tables with pagination
const getAllTables = asyncHandler(async (req, res, next) => {
  const { cursor, limit = 5 } = req.query;
  const pageSize = parseInt(limit, 10) || 5;

  let query = {};
  if (cursor) {
    query._id = { $gt: cursor };
  }

  // Fetch tables sorted by _id (ascending) with the specified limit
  const tables = await TableModel.find(query).sort({ _id: 1 }).limit(pageSize);

  if (!tables || tables.length === 0) {
    return next(new AppError(404, "No tables found"));
  }

  const tablesWithReservationStatus = await Promise.all(
    tables.map(async (table) => {
      const tableObject = table.toObject();
      tableObject.isReserved = await table.isReserved;
      return tableObject;
    })
  );

  const nextCursor =
    tables.length === pageSize ? tables[tables.length - 1]._id : null;
  const hasMore = !!nextCursor;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tables: tablesWithReservationStatus, nextCursor, hasMore },
        "Tables fetched successfully"
      )
    );
});

// Get a table by tableNumber
const getTableByNumber = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const table = await TableModel.findById(id);
  if (!table) {
    return next(new AppError(404, "Table not found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, table, "Table fetched successfully"));
});

// Update a table's reservation status (mark it as reserved or available)
const updateTableReservation = asyncHandler(async (req, res, next) => {
  const { tableNumber } = req.params;
  const { capacity, isReserved } = req.body;

  // Find the table by tableNumber
  const table = await TableModel.findOne({ tableNumber });
  if (!table) {
    return next(new AppError(404, "Table not found"));
  }

  // Update the reservation details
  table.capacity = parseInt(capacity) || table.capacity;
  table.isReserved = isReserved !== undefined ? isReserved : table.isReserved;

  await table.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, table, "Table reservation updated successfully")
    );
});

// Delete a table
const deleteTable = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const table = await TableModel.findByIdAndDelete(id);
  if (!table) {
    return next(new AppError(404, "Table not found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, table, "Table deleted successfully"));
});

export {
  createTable,
  getAllTables,
  getTableByNumber,
  updateTableReservation,
  deleteTable,
};
