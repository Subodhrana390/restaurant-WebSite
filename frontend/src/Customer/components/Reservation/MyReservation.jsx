import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const MyReservation = () => {
  const [reservations, setReservations] = useState([]);
  const { accessToken } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const fetchReservationDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/reservations/customer`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setReservations(response.data.data.reservations || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservationDetails();
  }, [accessToken]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reservation List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Table Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reservation Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time 
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reservation.table.tableNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reservation.customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(new Date(reservation.date))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(new Date(reservation.startTime))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(new Date(reservation.endTime))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(reservation.status)}
                    <span className="ml-2 capitalize">
                      {reservation.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReservation;
