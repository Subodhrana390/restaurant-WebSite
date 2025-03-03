import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const ViewCustomer = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/user/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUser(response.data.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-blue-600 font-medium mt-20">
        Loading user details...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-red-500 font-medium mt-20">
        No user found.
      </p>
    );
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600">
      <div className="w-full max-w-lg backdrop-blur-lg bg-white/20 p-8 rounded-xl shadow-lg border border-white/30 relative overflow-hidden">
        {/* Glassmorphism decoration elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-400/30 blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-300/30 blur-xl"></div>

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          User Details
        </h1>

        <div className="flex justify-center mb-4">
          <img
            src={`${import.meta.env.VITE_IMAGE_BASE_URL}/customer/${
              user.profileImage
            }`}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </div>

        <div className="space-y-4 text-white relative z-10">
          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">User ID</span>
            <span className="col-span-2 truncate">{user._id}</span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Name</span>
            <span className="col-span-2">{user.name}</span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Email</span>
            <span className="col-span-2">{user.email}</span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Phone</span>
            <span className="col-span-2">{user.phone}</span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Role</span>
            <span className="col-span-2">{user.role}</span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Status</span>
            <span className="col-span-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? "bg-green-500/80" : "bg-red-500/80"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Created</span>
            <span className="col-span-2">
              {moment(user.createdAt).format("DD MMM YYYY, hh:mm A")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomer;
