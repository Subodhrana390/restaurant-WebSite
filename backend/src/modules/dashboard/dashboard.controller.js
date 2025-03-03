import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { EmployeeModel } from "../../../Database/models/employee.model.js";
import { OrderModel } from "../../../Database/models/order.model.js";
import { UserModel } from "../../../Database/models/user.model.js";
import { ReservationModel } from "../../../Database/models/reservation.model.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const totalEmployees = await EmployeeModel.countDocuments();

  const totalRevenue = await OrderModel.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

  const salesByCategory = await OrderModel.aggregate([
    { $unwind: "$menuItems" },
    {
      $lookup: {
        from: "menus",
        localField: "menuItems.menuId",
        foreignField: "_id",
        as: "menuDetails",
      },
    },
    { $unwind: "$menuDetails" },
    {
      $group: {
        _id: "$menuDetails.category",
        totalSales: {
          $sum: { $multiply: ["$menuItems.quantity", "$menuItems.price"] },
        },
      },
    },
  ]);

  // Total Customers
  const totalCustomers = await UserModel.countDocuments();

  // Total Orders
  const totalOrders = await OrderModel.countDocuments();

  // Total Reservations
  const totalReservations = await ReservationModel.countDocuments();

  // Send the response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalEmployees,
        totalRevenue: revenue,
        salesByCategory,
        totalCustomers,
        totalOrders,
        totalReservations,
      },
      "successfully"
    )
  );
});
