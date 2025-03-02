import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export const TableModel = mongoose.model("Table", tableSchema);
