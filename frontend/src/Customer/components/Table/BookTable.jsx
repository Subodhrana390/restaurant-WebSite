import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const BookTable = () => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [persons, setPersons] = useState(1);
  const [showTableCard, setShowTableCard] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
  ];

  const convertToDate = (timeString, baseDate) => {
    return moment(`${baseDate} ${timeString}`, "YYYY-MM-DD hh:mm A").toDate();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const [startTime, endTime] = timeSlot.split(" - ");

      const requestedStartTime = convertToDate(startTime, date);
      const requestedEndTime = convertToDate(endTime, date);

      if (requestedStartTime < new Date()) {
        toast.error("Selected time slot is in the past.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/reservations`,
        {
          date,
          startTime: requestedStartTime,
          endTime: requestedEndTime,
          persons,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setResult(res.data.data);
      setShowTableCard(true);

      toast.success("Table booked successfully!");

      // Reset form
      setDate("");
      setTimeSlot("");
      setPersons(1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Book a Table
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Reserve your table at BrewMaster
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="" disabled>
                Select a time slot
              </option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Number of Persons
            </label>
            <select
              value={persons}
              onChange={(e) => setPersons(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              {[...Array(4).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1} {num + 1 === 1 ? "person" : "persons"}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300 disabled:bg-orange-300"
          >
            {loading ? "Booking..." : "Book Table"}
          </button>
        </form>

        {showTableCard && result && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Table Booked Successfully!
            </h2>
            <p className="text-green-700">
              Your table number is:{" "}
              <span className="font-bold">{result.tableNumber}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTable;
