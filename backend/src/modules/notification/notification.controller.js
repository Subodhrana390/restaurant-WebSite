import { NotificationModel } from "../../../Database/models/notification.model..js";
import ApiResponse from "../../utils/ApiResponse.js";
import { AppError } from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

const createNotification = async ({ recipientId, type, content, orderId }) => {
  const newNotification = new NotificationModel({
    recipientId,
    type,
    content,
    orderId,
  });

  await newNotification.save();
  return newNotification;
};

const getAllNotifications = asyncHandler(async (req, res) => {
  const recipientId = req.user._id;
  const { isRead, page = 1, limit = 10 } = req.query;

  const query = { recipientId };
  if (isRead !== undefined) {
    query.isRead = isRead === "true";
  }

  const notifications = await NotificationModel.find(query)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (notifications.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No notifications found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "Notifications fetched successfully")
    );
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await NotificationModel.findByIdAndUpdate(
    req.params.notificationId,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new AppError(404, "Notification not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, notification, "Notification mark read successfully")
    );
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const updatedNotifications = await NotificationModel.updateMany(
    { recipientId: req.user._id, isRead: false },
    { isRead: true }
  );

  if (updatedNotifications.modifiedCount === 0) {
    throw new AppError(404, "No unread notifications found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "All notifications marked as read successfully"
      )
    );
});

const deleteSingleNotification = asyncHandler(async (req, res) => {
  const notification = await NotificationModel.findByIdAndDelete(
    req.params.notificationId
  );

  if (!notification) {
    throw new AppError(404, "Notification not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, notification, "Notification deleted successfully")
    );
});

const deleteAllNotification = asyncHandler(async (req, res) => {
  const recipientId = req.user._id;
  console.log(recipientId);
  const result = await NotificationModel.deleteMany({ recipientId });
  if (result.deletedCount === 0) {
    throw new AppError(404, "No notifications found for the given recipientId");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: result.deletedCount },
        `Deleted ${result.deletedCount} notifications successfully`
      )
    );
});

export {
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteSingleNotification,
  deleteAllNotification,
  getAllNotifications,
};
