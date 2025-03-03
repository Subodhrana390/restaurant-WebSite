import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const lastReservationRef = useRef(null);
  const accessToken = localStorage.getItem("token");

  const fetchReservations = async (reset = false) => {
    if (reset) {
      setReservations([]);
      setCursor(null);
      setHasMore(true);
    }

    if (!hasMore) return;

    if (reset) {
      setLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/reservations`,
        {
          params: { cursor }, // Pass the cursor for pagination
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (
        !response.data ||
        !response.data.data ||
        !response.data.data.reservations
      ) {
        throw new Error("Invalid response data");
      }

      const newReservations = response.data.data.reservations;

      // Update the reservations state
      setReservations((prev) =>
        reset ? newReservations : [...prev, ...newReservations]
      );

      // Update the cursor and hasMore state
      if (response.data.data.nextCursor) {
        setCursor(response.data.data.nextCursor);
      } else {
        setHasMore(false); // No more reservations to fetch
      }
    } catch (error) {
    } finally {
      // Reset loading states
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchReservations(true);
  }, []);

  useEffect(() => {
    if (!lastReservationRef.current || !hasMore) return;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setIsFetchingMore(true);
          fetchReservations();
        }
      },
      { threshold: 1 }
    );

    observerInstance.observe(lastReservationRef.current);
    return () => observerInstance.disconnect();
  }, [reservations, hasMore, isFetchingMore]);

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.table.tableNumber.toString().includes(searchTerm) ||
      reservation.persons.toString().includes(searchTerm);

  
    return matchesSearch 
  });

  return (
    <div className="p-6 backdrop-blur-md rounded-lg text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservation Management</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 bg-white/10 border border-white/20 rounded"
          />
          <FaSearch className="absolute left-3 top-3" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading reservations...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded">
          No reservations found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-left">Table Number</th>
                <th className="p-3 text-left">Persons</th>
                <th className="p-3 text-left">Reservation Date</th>
                <th className="p-3 text-left">Booking Status</th>
                <th className="p-3 text-left">Customer name</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation, index) => (
                <tr
                  key={reservation._id}
                  className="border-t border-white/10 hover:bg-white/5"
                  ref={
                    index === filteredReservations.length - 1
                      ? lastReservationRef
                      : null
                  }
                >
                  <td className="p-3">{reservation.table.tableNumber}</td>
                  <td className="p-3">{reservation.persons}</td>
                  <td className="p-3">
                    {new Date(reservation.date).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        reservation.status === "confirmed"
                          ? "bg-green-500/90"
                          : reservation.status === "pending"
                          ? "bg-yellow-500/30"
                          : "bg-red-500/30"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="p-3">{reservation?.customer.name}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/reservations/view/${reservation._id}`}
                        className="p-2 bg-blue-600/50 rounded hover:bg-blue-700/60"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => console.log("Delete", reservation._id)}
                        className="p-2 bg-red-600/50 rounded hover:bg-red-700/60"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
