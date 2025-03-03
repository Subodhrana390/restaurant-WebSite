import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateDish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("token");
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
    addons: [],
    image: null,
  });

  // Fetch dish details by ID and pre-p opulate form fields
  useEffect(() => {
    async function fetchDish() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/menu/${id}`
        );
        const dish = response.data.data;
        setFormData({
          name: dish.name || "",
          description: dish.description || "",
          category: dish.category || "",
          price: dish.price || "",
          discount: dish.discount || "0",
          ingredients: dish.ingredients ? dish.ingredients.join(", ") : "",
          isAvailable: dish.isAvailable,
          isVeg: dish.isVeg,
          spiceLevel: dish.spiceLevel || "medium",
          addons: dish.addOns
            ? dish.addOns
                .map((addon) => `${addon.name}:${addon.price}`)
                .join(", ")
            : "",
          image: null,
        });
      } catch (error) {
        console.error("Error fetching dish:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDish();
  }, [id]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // Parse addons from string input
  const parseAddons = (addonsString) => {
    if (!addonsString) return [];
    return addonsString.split(",").map((addon) => {
      const [name, price] = addon.split(":");
      return { name: name.trim(), price: parseFloat(price) };
    });
  };

  const parseIngredients = (ingredientsString) => {
    return ingredientsString
      .split(",") // Split by comma
      .map((item) => item.trim()) // Trim spaces from each item
      .filter((item) => item.length > 0); // Remove empty items
  };

  // Handle form submission to update dish
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("discount", formData.discount);
    data.append(
      "ingredients",
      JSON.stringify(parseIngredients(formData.ingredients))
    );
    data.append("isAvailable", formData.isAvailable);
    data.append("isVeg", formData.isVeg);
    data.append("spiceLevel", formData.spiceLevel.toLowerCase());
    data.append("addons", JSON.stringify(parseAddons(formData.addons)));
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.put(`${import.meta.env.VITE_APP_BASE_URL}/menu/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate("/admin/menu");
    } catch (error) {
      toast.error("Access denied. Admins only.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading dish data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glassmorphism-blue p-6 backdrop-blur-md border border-white/20 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <FaEdit /> Update Dish
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dish Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dish Name"
              className="mt-1 w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded text-white backdrop-blur-sm"
              required
            />
          </div>
          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Dish description"
              className="mt-1 w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded text-white backdrop-blur-sm"
            />
          </div>
          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-300"
            >
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded text-white backdrop-blur-sm"
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
          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-300"
            >
              Price:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="mt-1 w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded text-white backdrop-blur-sm"
              required
            />
          </div>
          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-300"
            >
              Discount (%):
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount"
              className="mt-1 w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded text-white backdrop-blur-sm"
            />
          </div>
          {/* Ingredients */}
          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium text-gray-300"
            >
              Ingredients (comma separated):
            </label>
            <input
              type="text"
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="e.g., tomato, mozzarella, basil"
              className="mt-1 w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded text-white backdrop-blur-sm"
            />
          </div>
          {/* Availability */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-300">
              Available
            </label>
          </div>
          {/* Vegetarian */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isVeg"
              name="isVeg"
              checked={formData.isVeg}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isVeg" className="text-sm text-gray-300">
              Vegetarian
            </label>
          </div>
          {/* Spice Level */}
          <div>
            <label
              htmlFor="spiceLevel"
              className="block text-sm font-medium text-gray-300"
            >
              Spice Level:
            </label>
            <select
              id="spiceLevel"
              name="spiceLevel"
              value={formData.spiceLevel}
              onChange={handleChange}
              className="mt-1 w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded text-white backdrop-blur-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {/* Addons */}
          <div>
            <label
              htmlFor="addons"
              className="block text-sm font-medium text-gray-300"
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
              className="mt-1 w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded text-white backdrop-blur-sm"
            />
          </div>
          {/* Dish Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-300"
            >
              Dish Image:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 w-full p-2 bg-gray-700/50 border border-gray-600/50 rounded text-white backdrop-blur-sm"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium text-white transition duration-200"
          >
            Update Dish
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateDish;
