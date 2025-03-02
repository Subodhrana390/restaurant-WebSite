import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [cursor, setCursor] = useState(null); // Cursor for pagination
  const [hasMore, setHasMore] = useState(true); // Check if more data is available
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Fetch reservations
  const fetchReservations = async (reset = false) => {
    if (reset) {
      setReservations([]);
      setCursor(null);
      setHasMore(true);
    }

    if (!hasMore) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/reservations`,
        {
          params: { limit: 10, cursor },
        }
      );

      const newReservations = response.data.data.reservations;
      setReservations((prev) =>
        reset ? newReservations : [...prev, ...newReservations]
      );

      // Update cursor for next batch
      if (newReservations.length > 0) {
        setCursor(newReservations[newReservations.length - 1]._id);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchReservations(true);
  }, []);

  // Filter reservations based on search & status
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.table.tableNumber.toString().includes(searchTerm) ||
      reservation.persons.toString().includes(searchTerm);

    const matchesStatus = filterStatus
      ? reservation.status === filterStatus
      : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservation Management</h1>
        <Link
          to="/admin/reservations/add"
          className="flex items-center px-4 py-2 bg-green-600/80 hover:bg-green-700/90 rounded transition-colors backdrop-blur-sm"
        >
          <FaPlus className="mr-2" />
          Add New Reservation
        </Link>
      </div>

      {/* Search & Filters */}
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

      {/* Reservation List */}
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
              {filteredReservations.map((reservation) => (
                <tr
                  key={reservation._id}
                  className="border-t border-white/10 hover:bg-white/5"
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

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsFetchingMore(true);
              fetchReservations();
            }}
            disabled={isFetchingMore}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded transition"
          >
            {isFetchingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
