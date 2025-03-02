import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const ViewReservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/reservations/${id}`
        );
        setReservation(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch reservation details");
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-blue-600 font-medium mt-20">
        Loading reservation details...
      </p>
    );
  }

  if (!reservation) {
    return (
      <p className="text-center text-red-500 font-medium mt-20">
        No reservation found.
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
          Reservation Details
        </h1>

        <div className="space-y-4 text-white relative z-10">
          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Reservation ID</span>
            <span className="col-span-2 truncate">{reservation._id}</span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Table Number</span>
            <span className="col-span-2">{reservation.table?.tableNumber}</span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Capacity</span>
            <span className="col-span-2">
              {reservation?.table?.capacity} persons
            </span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Persons</span>
            <span className="col-span-2">{reservation.persons}</span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Status</span>
            <span className="col-span-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  reservation.status === "confirmed"
                    ? "bg-green-500/80"
                    : reservation.status === "pending"
                    ? "bg-yellow-500/80"
                    : reservation.status === "cancelled"
                    ? "bg-red-500/80"
                    : "bg-gray-500/80"
                }`}
              >
                {reservation.status}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Reservation Date</span>
            <span className="col-span-2">
              {new Date(reservation.date).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}
            </span>
          </div>

          <div className="grid grid-cols-3 p-3 rounded-lg bg-blue-700/30 border border-blue-400/30">
            <span className="col-span-1 font-semibold">Time</span>
            <span className="col-span-2">
            {moment(reservation.startTime).format("MM/DD/YYYY hh:mm A")} -{" "}
            {moment(reservation.endTime).format("MM/DD/YYYY hh:mm A")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReservation;
