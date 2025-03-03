import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reservedStatus, setReservedStatus] = useState("");
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/tables`,
        {
          params: {
            cursor,
            limit: 10,
            search: searchTerm || undefined,
            reserved: reservedStatus !== "" ? reservedStatus : undefined,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const newTables = response.data.data.tables;

      // Prevent duplicate entries
      setTables((prev) => {
        const existingIds = new Set(prev.map((table) => table._id));
        const filteredNewTables = newTables.filter(
          (table) => !existingIds.has(table._id)
        );
        return [...prev, ...filteredNewTables];
      });

      setCursor(response.data.data.nextCursor || null);
      setHasMore(response.data.data.nextCursor !== null);
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const filteredTables = tables.filter((table) => {
    // Filter by search term
    const matchesSearch = searchTerm
      ? table.tableNumber.toString().includes(searchTerm) ||
        table.capacity.toString().includes(searchTerm)
      : true;

    // Filter by reservation status
    const matchesStatus =
      reservedStatus !== ""
        ? table.isReserved.toString() === reservedStatus
        : true;

    return matchesSearch && matchesStatus;
  });

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop <=
        e.target.clientHeight + 10 &&
      hasMore
    ) {
      fetchTables();
    }
  };

  return (
    <div
      className="p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white overflow-y-auto h-[500px]"
      onScroll={handleScroll}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Table Management</h1>
        <Link
          to="/admin/tables/add"
          className="flex items-center px-4 py-2 bg-green-600/80 hover:bg-green-700/90 rounded transition-colors backdrop-blur-sm"
        >
          <FaPlus className="mr-2" /> Add New Table
        </Link>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search Table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 bg-white/10 border border-white/20 rounded"
          />
          <FaSearch className="absolute left-3 top-3" />
        </div>
        <select
          value={reservedStatus}
          onChange={(e) => setReservedStatus(e.target.value)}
          className="p-2 bg-white/10 border border-white/20 rounded"
        >
          <option value="">All</option>
          <option value="true">Reserved</option>
          <option value="false">Not Reserved</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <p>Loading tables...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-white/10 text-sm font-semibold">
              <tr>
                <th className="p-3 text-left">Table Number</th>
                <th className="p-3 text-left">Capacity</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.map((table) => (
                <tr
                  key={table._id}
                  className="border-t border-white/10 hover:bg-white/10 transition"
                >
                  <td className="p-3">{table.tableNumber}</td>
                  <td className="p-3">{table.capacity}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/tables/view/${table._id}`}
                        className="p-2 bg-blue-600/50 rounded hover:bg-blue-700/60"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/admin/tables/edit/${table._id}`}
                        className="p-2 bg-yellow-600/50 rounded hover:bg-yellow-700/60"
                      >
                        <FaEdit />
                      </Link>
                      <button className="p-2 bg-red-600/50 rounded hover:bg-red-700/60">
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
      {isFetching && <p className="text-center py-4">Loading more...</p>}
    </div>
  );
};

export default TableList;
