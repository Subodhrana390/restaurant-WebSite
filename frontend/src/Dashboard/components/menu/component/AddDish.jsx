import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaUtensils,
  FaTag,
  FaPercent,
  FaLeaf,
  FaFire,
  FaPizzaSlice,
  FaImage,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const AddDish = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "0",
    ingredients: "",
    isAvailable: true,
    isVeg: true,
    spiceLevel: "medium",
    addons: "",
    image: null,
  });
  const accessToken = localStorage.getItem("token");
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseAddons = (addonsString) => {
    if (!addonsString) return [];
    return addonsString.split(",").map((addon) => {
      const [name, price] = addon.split(":");
      return { name: name.trim(), price: parseFloat(price) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("discount", formData.discount);
    data.append("ingredients", formData.ingredients);
    data.append("isAvailable", formData.isAvailable);
    data.append("isVeg", formData.isVeg);
    data.append("spiceLevel", formData.spiceLevel);
    data.append("addons", JSON.stringify(parseAddons(formData.addons)));
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/menu`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success("Dish added successfully!");
      navigate("/admin/menu");
    } catch (error) {
      toast.error("Access denied. Admins only.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center backdrop-filter p-4">
      <div className="backdrop-blur-md bg-blue-100 bg-opacity-20 p-6 rounded-xl shadow-lg border border-blue-200 border-opacity-30 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-800">
          <FaPlus className="text-blue-600" /> Add New Dish
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dish Name */}
          <div className="relative">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              <FaUtensils className="inline mr-2 text-blue-600" /> Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dish Name"
              className="w-full p-3 bg-white bg-opacity-60 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800 placeholder-blue-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Dish description"
              rows="3"
              className="w-full p-3 bg-white bg-opacity-60 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800 placeholder-blue-400"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              <FaTag className="inline mr-2 text-blue-600" /> Category:
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-white bg-opacity-60 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
              required
            >
              <option value="">Select Category</option>
              <option value="starter">Starter</option>
              <option value="main course">Main Course</option>
              <option value="dessert">Dessert</option>
              <option value="beverage">Beverage</option>
              <option value="side dish">Side Dish</option>
            </select>
          </div>

          {/* Price & Discount - Two columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-blue-700 mb-1"
              >
                <FaTag className="inline mr-2 text-blue-600" /> Price:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-blue-700">₹</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full p-3 pl-8 bg-white bg-opacity-60 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Discount */}
            <div>
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-blue-700 mb-1"
              >
                <FaPercent className="inline mr-2 text-blue-600" /> Discount:
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full p-3 pr-8 bg-white bg-opacity-60 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-3 text-blue-700">%</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              <FaPizzaSlice className="inline mr-2 text-blue-600" /> Ingredients
              (comma separated):
            </label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="e.g., tomato, mozzarella, basil"
              className="w-full p-3 bg-white bg-opacity-60 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800 placeholder-blue-400"
            />
          </div>

          {/* Checkboxes - Two columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Availability */}
            <div className="flex items-center p-3 bg-white bg-opacity-40 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isAvailable"
                className="ml-2 text-sm text-blue-700"
              >
                Available
              </label>
            </div>

            {/* Vegetarian */}
            <div className="flex items-center p-3 bg-white bg-opacity-40 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                id="isVeg"
                name="isVeg"
                checked={formData.isVeg}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isVeg" className="ml-2 text-sm text-blue-700">
                <FaLeaf className="inline mr-1 text-green-600" /> Vegetarian
              </label>
            </div>
          </div>

          {/* Spice Level */}
          <div>
            <label
              htmlFor="spiceLevel"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              <FaFire className="inline mr-2 text-orange-500" /> Spice Level:
            </label>
            <div className="flex gap-4">
              <label
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border ${
                  formData.spiceLevel === "low"
                    ? "bg-green-100 border-green-300"
                    : "bg-white bg-opacity-40 border-blue-200"
                } cursor-pointer transition-colors`}
              >
                <input
                  type="radio"
                  name="spiceLevel"
                  value="low"
                  checked={formData.spiceLevel === "low"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={
                    formData.spiceLevel === "low"
                      ? "text-green-700"
                      : "text-blue-700"
                  }
                >
                  Low
                </span>
              </label>

              <label
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border ${
                  formData.spiceLevel === "medium"
                    ? "bg-yellow-100 border-yellow-300"
                    : "bg-white bg-opacity-40 border-blue-200"
                } cursor-pointer transition-colors`}
              >
                <input
                  type="radio"
                  name="spiceLevel"
                  value="medium"
                  checked={formData.spiceLevel === "medium"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={
                    formData.spiceLevel === "medium"
                      ? "text-yellow-700"
                      : "text-blue-700"
                  }
                >
                  Medium
                </span>
              </label>

              <label
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border ${
                  formData.spiceLevel === "high"
                    ? "bg-red-100 border-red-300"
                    : "bg-white bg-opacity-40 border-blue-200"
                } cursor-pointer transition-colors`}
              >
                <input
                  type="radio"
                  name="spiceLevel"
                  value="high"
                  checked={formData.spiceLevel === "high"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className={
                    formData.spiceLevel === "high"
                      ? "text-red-700"
                      : "text-blue-700"
                  }
                >
                  High
                </span>
              </label>
            </div>
          </div>

          {/* Addons */}
          <div>
            <label
              htmlFor="addons"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              Addons (format: Name:Price, separated by comma):
            </label>
            <input
              type="text"
              id="addons"
              name="addons"
              value={formData.addons}
              onChange={handleChange}
              placeholder="Extra Cheese:1.5, Olives:0.99"
              className="w-full p-3 bg-white bg-opacity-60 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800 placeholder-blue-400"
            />
            {formData.addons && (
              <div className="mt-2 text-xs text-blue-600">
                {parseAddons(formData.addons).map((addon, idx) => (
                  <span
                    key={idx}
                    className="inline-block mr-2 mb-1 px-2 py-1 bg-blue-100 rounded-full"
                  >
                    {addon.name}: ${addon.price.toFixed(2)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dish Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-blue-700 mb-1"
            >
              <FaImage className="inline mr-2 text-blue-600" /> Dish Image:
            </label>
            <div className="mt-1 flex items-center">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white bg-opacity-60 text-blue-700 rounded-lg border border-blue-300 border-dashed cursor-pointer hover:bg-blue-50">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-sm">Select an image</span>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Image preview */}
            {imagePreview && (
              <div className="mt-3 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-cover rounded-lg border border-blue-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: null }));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition duration-200 shadow-md"
            >
              <FaPlus className="inline mr-2" /> Add Dish
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/menu")}
              className="w-full mt-3 py-3 bg-transparent border border-blue-500 hover:bg-blue-50 rounded-lg font-medium text-blue-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDish;
