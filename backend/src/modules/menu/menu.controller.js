import { MenuModel } from "../../../Database/models/menu.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { AppError } from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

// 📌 Create a new menu item
const createMenuItem = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    category,
    price,
    discount,
    ingredients,
    isAvailable,
    isVeg,
    spiceLevel,
    addons,
  } = req.body;

  if (!name || !price || !category) {
    return next(new AppError(400, "Name, price, and category are required"));
  }

  let parsedIngredients = ingredients.split(",").join(" ");
  let image = req.file ? req.file.filename : null;
  // Compute final price after discount
  const finalPrice = price - price * (discount / 100);

  const newMenuItem = await MenuModel.create({
    name,
    description,
    category,
    price,
    discount,
    finalPrice,
    image,
    ingredients: parsedIngredients,
    isAvailable,
    isVeg,
    spiceLevel,
    addOns: JSON.parse(addons),
  });

  res
    .status(201)
    .json(new ApiResponse(201, newMenuItem, "Menu item created successfully"));
});

// 📌 Get all menu items
const getAllMenuItems = asyncHandler(async (req, res, next) => {
  let { cursor, category, limit = 10 } = req.query;
  limit = parseInt(limit, 10) || 10;

  const query = cursor ? { _id: { $gt: cursor } } : {};
  if (category) query.category = category;

  const menuItems = await MenuModel.find(query)
    .sort({ _id: 1 })
    .limit(limit + 1);

  if (!menuItems.length) {
    return next(new AppError(404, "No menu items found"));
  }

  // Check if there are more items to fetch
  const hasMore = menuItems.length > limit;
  if (hasMore) menuItems.pop(); // Remove extra item from response

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { menuItems, hasMore },
        "Menu items fetched successfully"
      )
    );
});

// 📌 Get a single menu item by ID
const getMenuItemById = asyncHandler(async (req, res, next) => {
  const menuItem = await MenuModel.findById(req.params.id);
  if (!menuItem) {
    return next(new AppError(404, "Menu item not found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, menuItem, "Menu item fetched successfully"));
});

// 📌 Update a menu item
const updateMenuItem = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    category,
    price,
    discount,
    ingredients,
    isAvailable,
    isVeg,
    spiceLevel,
    addons,
  } = req.body;
  // Ensure price and discount are numbers
  const priceNum = parseFloat(price);
  const discountNum = parseFloat(discount);

  if (isNaN(priceNum) || isNaN(discountNum)) {
    return next(new AppError(400, "Invalid price or discount value"));
  }

  // Compute final price
  const finalPrice = priceNum - priceNum * (discountNum / 100);

  // Parse ingredients correctly
  let parsedIngredients;
  try {
    parsedIngredients = Array.isArray(ingredients)
      ? ingredients
      : JSON.parse(ingredients);
  } catch (error) {
    return next(new AppError(400, "Invalid ingredients format"));
  }

  // Parse addons safely
  let parsedAddons;
  try {
    parsedAddons = Array.isArray(addons) ? addons : JSON.parse(addons);
  } catch (error) {
    return next(new AppError(400, "Invalid addons format"));
  }

  // Prepare update fields
  const updateFields = {
    name,
    description,
    category,
    price: priceNum,
    discount: discountNum,
    finalPrice,
    ingredients: parsedIngredients,
    isAvailable,
    isVeg,
    spiceLevel,
    addons: parsedAddons,
  };

  // Only update image if a new file is uploaded
  if (req.file) {
    updateFields.image = req.file.filename;
  }

  // Update menu item
  const updatedMenuItem = await MenuModel.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  );

  if (!updatedMenuItem) {
    return next(new AppError(404, "Menu item not found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedMenuItem, "Menu item updated successfully")
    );
});

// 📌 Delete a menu item
const deleteMenuItem = asyncHandler(async (req, res, next) => {
  const deletedMenuItem = await MenuModel.findByIdAndDelete(req.params.id);
  if (!deletedMenuItem) {
    return next(new AppError(404, "Menu item not found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, null, "Menu item deleted successfully"));
});

// 📌 Add a review to a menu item
const addReview = asyncHandler(async (req, res, next) => {
  const { userId, comment, rating } = req.body;

  const menuItem = await MenuModel.findById(req.params.id);
  if (!menuItem) {
    return next(new AppError(404, "Menu item not found"));
  }

  if (!userId || !rating) {
    return next(new AppError(400, "User ID and rating are required"));
  }

  menuItem.ratings.reviews.push({ user: userId, comment, rating });

  // Recalculate the average rating
  const totalReviews = menuItem.ratings.reviews.length;
  const totalRating = menuItem.ratings.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  menuItem.ratings.average = totalReviews > 0 ? totalRating / totalReviews : 0;

  await menuItem.save();
  res
    .status(200)
    .json(new ApiResponse(200, menuItem, "Review added successfully"));
});

// 📌 Get menu items by category
const getMenuByCategory = asyncHandler(async (req, res, next) => {
  const category = req.params.category;
  const { cursor, limit = 10 } = req.query;
  const pageSize = parseInt(limit, 10) || 10;

  // Build query with category filter and, if provided, cursor pagination
  let query = { category };
  if (cursor) {
    query._id = { $gt: cursor };
  }

  // Fetch menu items sorted by _id in ascending order
  const menuItems = await MenuModel.find(query)
    .sort({ _id: 1 })
    .limit(pageSize);

  if (!menuItems.length) {
    return next(new AppError(404, "No items found in this category"));
  }

  // Determine nextCursor for pagination
  const nextCursor =
    menuItems.length === pageSize ? menuItems[menuItems.length - 1]._id : null;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { menuItems, nextCursor },
        "Menu items fetched successfully by category"
      )
    );
});

export {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  addReview,
  getMenuByCategory,
};
