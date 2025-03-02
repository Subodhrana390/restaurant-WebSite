import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Dish Name
    description: { type: String }, // Description of the dish
    category: {
      type: String,
      enum: ["starter", "main course", "dessert", "beverage", "side dish"],
      required: true,
    }, // Food Category 
    price: { type: Number, required: true }, // Price of the dish
    discount: { type: Number, default: 0 }, // Discount in percentage
    finalPrice: { type: Number }, // Price after discount (computed)
    image: { type: String, default: null }, // Image URL of the dish
    ingredients: [{ type: String }], // List of ingredients used
    isAvailable: { type: Boolean, default: true }, // Availability of the dish
    isVeg: { type: Boolean, default: true }, // Vegetarian or Non-Vegetarian
    spiceLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    }, // Spice Level
    addOns: [
      {
        name: String,
        price: Number,
      },
    ],
    ratings: {
      average: { type: Number, default: 0 },
      reviews: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
          comment: { type: String },
          rating: { type: Number, required: true, min: 1, max: 5 }, // Required Rating between 1-5
        },
      ], // Customer Reviews
    },
  },
  { timestamps: true }
);

// Compute Final Price after Discount
menuSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

export const MenuModel = mongoose.model("Menu", menuSchema);
