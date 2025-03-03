import { ReservationModel } from "../../../Database/models/reservation.model.js";
import { TableModel } from "../../../Database/models/table.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { AppError } from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

const isTableAvailable = async (
  requestedStartTime,
  requestedEndTime,
  tableId
) => {
  const overlappingReservation = await ReservationModel.findOne({
    table: tableId,
    status: { $in: ["pending", "confirmed"] },
    $and: [
      { startTime: { $lt: requestedEndTime } },
      { endTime: { $gt: requestedStartTime } },
    ],
  });

  return !overlappingReservation;
};

const createReservation = asyncHandler(async (req, res) => {
  const { startTime, endTime, persons } = req.body;
  const customerId = req.user._id;
  const tables = await TableModel.find({ capacity: { $gte: persons } });

  if (tables.length === 0) {
    return res.status(400).json({
      message: "No tables available for the requested number of persons.",
    });
  }

  let allocatedTable = null;

  for (const table of tables) {
    const available = await isTableAvailable(startTime, endTime, table._id);
    if (available) {
      allocatedTable = table;
      break;
    }
  }

  if (!allocatedTable) {
    return res.status(400).json({
      message: "No tables available for the selected date and time slot.",
    });
  }

  const reservation = new ReservationModel({
    customer: customerId,
    table: allocatedTable._id,
    date: new Date(),
    startTime,
    endTime,
    persons,
    status: "confirmed",
  });
  await reservation.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { tableNumber: allocatedTable.tableNumber, reservation },
        "Reservation created successfully"
      )
    );
});

const getAllReservations = asyncHandler(async (req, res, next) => {
  const { cursor, sort = "asc" } = req.query;
  const sortOrder = sort === "desc" ? -1 : 1;

  let query = {};
  if (cursor) {
    query._id = sortOrder === 1 ? { $gt: cursor } : { $lt: cursor };
  }

  let reservations = await ReservationModel.find(query)
    .sort({ _id: sortOrder })
    .populate("customer table")
    .select("customer table date persons status");

  const hasMore = reservations.length > 0;
  const nextCursor = hasMore ? reservations[reservations.length - 1]._id : null;

  res.status(200).json(
    new ApiResponse(
      200,
      { reservations, nextCursor, hasMore },
      "Reservations fetched successfully"
    )
  );
});


const getAllReservationByCustomer = asyncHandler(async (req, res, next) => {
  const { cursor, limit = 5, sort = "asc" } = req.query;
  const pageSize = parseInt(limit, 10) || 5;
  const sortOrder = sort === "desc" ? -1 : 1; // Allow ascending/descending order
  const customerId = req.user._id; // Get the logged-in customer's ID

  // Validate cursor as a valid ObjectId
  if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
    return next(new AppError(400, "Invalid cursor format"));
  }

  // Build the query
  let query = { customer: customerId.toString() };
  if (cursor) {
    query._id = sortOrder === 1 ? { $gt: cursor } : { $lt: cursor };
  }

  // Fetch reservations
  const reservations = await ReservationModel.find(query)
    .sort({ _id: sortOrder })
    .limit(pageSize)
    .populate("customer table")
    .select("customer table date persons status startTime endTime");

  // Determine the next cursor for pagination
  const nextCursor =
    reservations.length === pageSize
      ? reservations[reservations.length - 1]._id
      : null;

  // Send response
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { reservations, nextCursor },
        "Reservations fetched successfully"
      )
    );
});

const getReservationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reservation = await ReservationModel.findById(id).populate("table customer");

  if (!reservation) {
    throw new AppError(404, "Reservation not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, reservation, "Reservation fetched successfully")
    );
});

// Update a reservation (e.g., change status or update details)
const updateReservation = asyncHandler(async (req, res) => {
  const { reservationId } = req.params;
  const { status, reservationDate, specialRequests } = req.body;

  // Find the reservation
  const reservation = await ReservationModel.findById(reservationId);

  if (!reservation) {
    throw new AppError(404, "Reservation not found");
  }

  // Update reservation details
  reservation.status = status || reservation.status;
  reservation.reservationDate = reservationDate || reservation.reservationDate;
  reservation.specialRequests = specialRequests || reservation.specialRequests;

  reservation.status === "completed";

  await reservation.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, "Reservation updated successfully", reservation)
    );
});

// Delete a reservation
const deleteReservation = asyncHandler(async (req, res) => {
  const { reservationId } = req.params;

  const reservation = await ReservationModel.findByIdAndDelete(reservationId);

  if (!reservation) {
    throw new AppError(404, "Reservation not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Reservation deleted successfully", reservation)
    );
});

export {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  getAllReservationByCustomer,
};
