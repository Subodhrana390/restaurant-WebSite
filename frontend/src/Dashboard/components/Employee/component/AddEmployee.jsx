import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    salary: "",
    shift: "",
    password: "",
    status: "active",
    dateOfJoining: "",
    profileImage: null,
    address: {
      street: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
    },
  });

  // Handle text and select field changes (for main form fields)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle address field changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: e.target.files[0],
    }));
  };

  // Simulate an API call on form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/employee`,
        formData,
        {
          headers: {
            "Content-Type": "'multipart/form-data",
          },
        }
      );
    } catch (error) {}
    navigate("/admin/employees");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="bg-inherit p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <FaPlus /> Add New Employee
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
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
              placeholder="John Doe"
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-300"
            >
              Phone:
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-300"
            >
              Role:
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
              <option value="waiter">Waiter</option>
              <option value="cashier">Cashier</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          {/* Salary */}
          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-300"
            >
              Salary:
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="4500"
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Shift */}
          <div>
            <label
              htmlFor="shift"
              className="block text-sm font-medium text-gray-300"
            >
              Shift:
            </label>
            <select
              id="shift"
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Shift</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-300"
            >
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          {/* Date of Joining */}
          <div>
            <label
              htmlFor="dateOfJoining"
              className="block text-sm font-medium text-gray-300"
            >
              Date of Joining:
            </label>
            <input
              type="date"
              id="dateOfJoining"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Profile Image */}
          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-300"
            >
              Profile Image:
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 w-full text-gray-200 file:py-2 file:px-4 file:border file:border-gray-600 file:bg-gray-700 file:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Address Fields */}
          <fieldset className="border border-gray-600 p-4 rounded">
            <legend className="text-lg font-medium text-gray-300">
              Address
            </legend>
            {/* Street */}
            <div className="mt-2">
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-300"
              >
                Street:
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                placeholder="123 Main St"
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* City */}
            <div className="mt-2">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-300"
              >
                City:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                placeholder="City Name"
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* State */}
            <div className="mt-2">
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-300"
              >
                State:
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.address.state}
                onChange={handleAddressChange}
                placeholder="State Name"
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Pin Code */}
            <div className="mt-2">
              <label
                htmlFor="pinCode"
                className="block text-sm font-medium text-gray-300"
              >
                Pin Code:
              </label>
              <input
                type="text"
                id="pinCode"
                name="pinCode"
                value={formData.address.pinCode}
                onChange={handleAddressChange}
                placeholder="Postal Code"
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Country */}
            <div className="mt-2">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-300"
              >
                Country:
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.address.country}
                onChange={handleAddressChange}
                placeholder="Country Name"
                className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </fieldset>
          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-medium text-white transition duration-200"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
