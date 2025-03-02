import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who wrote the review
    rating: { type: Number, required: true, min: 1, max: 5 }, // Star rating (1-5)
    comment: { type: String, maxlength: 500 }, // Optional feedback
  },
  { timestamps: true }
);

reviewSchema.index({ customer: 1 }, { unique: true });

export const ReviewModel = mongoose.model("Review", reviewSchema);
