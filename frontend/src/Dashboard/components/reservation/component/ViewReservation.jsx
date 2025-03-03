import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowLeft } from "react-icons/fa";

const ViewReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/reservations/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
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
    <div className="min-h-screen bg-gradient-to-br from-white-900 to-blue-600">
      <div className="p-4 h-20 flex justify-start items-center gap-6">
        <button>
          <FaArrowLeft className="w-6 h-6" onClick={() => navigate(-1)} />
        </button>
        <h1 className="text-2xl font-bold text-white text-center">
          Reservation Details
        </h1>
      </div>

      <div>
        <div>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default ViewReservation;
