import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/employee/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setEmployee(response.data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [id]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg text-white">Loading employee data...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-lg">Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white max-w-2xl mx-auto shadow-2xl transform transition-all duration-300">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Employee Details */}
      <h1 className="text-3xl font-bold mb-6 text-center text-white/90">
        Employee Details
      </h1>
      <div className="space-y-4">
        <div className="bg-white/10 p-4 rounded-lg shadow-md">
          <strong className="text-blue-400">Name:</strong>{" "}
          <span className="text-white/90">{employee.name}</span>
        </div>
        <div className="bg-white/10 p-4 rounded-lg shadow-md">
          <strong className="text-blue-400">Email:</strong>{" "}
          <span className="text-white/90">{employee.email}</span>
        </div>
        <div className="bg-white/10 p-4 rounded-lg shadow-md">
          <strong className="text-blue-400">Phone:</strong>{" "}
          <span className="text-white/90">{employee.phone}</span>
        </div>
        <div className="bg-white/10 p-4 rounded-lg shadow-md">
          <strong className="text-blue-400">Role:</strong>{" "}
          <span className="text-white/90">{employee.role}</span>
        </div>
        <div className="bg-white/10 p-4 rounded-lg shadow-md">
          <strong className="text-blue-400">Salary:</strong>{" "}
          <span className="text-white/90">{employee.salary}</span>
        </div>
        <div className="bg-white/10 p-4 rounded-lg shadow-md">
          <strong className="text-blue-400">Shift:</strong>{" "}
          <span className="text-white/90">{employee.shift}</span>
        </div>
        <div className="bg-white/10 p-4 rounded-lg shadow-md">
          <strong className="text-blue-400">Status:</strong>{" "}
          <span className="text-white/90">{employee.status}</span>
        </div>
        <div className="bg-white/10 p-4 rounded-lg shadow-md">
          <strong className="text-blue-400">Date of Joining:</strong>{" "}
          <span className="text-white/90">
            {formatDate(employee.dateOfJoining)}
          </span>
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-white/90">
          Address
        </h2>
        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-lg shadow-md">
            <strong className="text-blue-400">Street:</strong>{" "}
            <span className="text-white/90">{employee.address.street}</span>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-md">
            <strong className="text-blue-400">City:</strong>{" "}
            <span className="text-white/90">{employee.address.city}</span>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-md">
            <strong className="text-blue-400">State:</strong>{" "}
            <span className="text-white/90">{employee.address.state}</span>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-md">
            <strong className="text-blue-400">Pin Code:</strong>{" "}
            <span className="text-white/90">{employee.address.pinCode}</span>
          </div>
          <div className="bg-white/10 p-4 rounded-lg shadow-md">
            <strong className="text-blue-400">Country:</strong>{" "}
            <span className="text-white/90">{employee.address.country}</span>
          </div>
        </div>
      </div>

      {/* Profile Image */}
      {employee.profileImage && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white/90">
            Profile Image
          </h2>
          <img
            src={`${import.meta.env.VITE_IMAGE_BASE_URL}/employee/${
              employee.profileImage
            }`}
            alt={employee.name}
            className="w-40 h-40 object-cover rounded-full mx-auto border-4 border-blue-400 shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ViewEmployee;
