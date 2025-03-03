import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaMoneyBillAlt,
  FaShoppingCart,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/dashboard`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.data || !res.data.data) {
        throw new Error("Invalid response data");
      }

      setDashboardData(res.data.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
      toast.error("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format salesByCategory for the chart
  const chartData = dashboardData?.salesByCategory?.map((item) => ({
    name: item._id,
    sales: item.totalSales,
  }));

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <div className="p-6 bg-transparent backdrop-blur-xl min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-transparent backdrop-blur-xl min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-transparent backdrop-blur-xl min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center"
        >
          <FaUsers className="text-3xl text-blue-500 mr-4" />
          <div>
            <p className="text-gray-600">Total Employees</p>
            <p className="text-2xl font-bold">{dashboardData.totalEmployees}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center"
        >
          <FaUsers className="text-3xl text-blue-500 mr-4" />
          <div>
            <p className="text-gray-600">Total Customers</p>
            <p className="text-2xl font-bold">{dashboardData.totalCustomers}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center"
        >
          <FaMoneyBillAlt className="text-3xl text-green-500 mr-4" />
          <div>
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold">₹ {dashboardData.totalRevenue}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center"
        >
          <FaShoppingCart className="text-3xl text-purple-500 mr-4" />
          <div>
            <p className="text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{dashboardData.totalOrders}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md flex items-center"
        >
          <FaCalendarAlt className="text-3xl text-orange-500 mr-4" />
          <div>
            <p className="text-gray-600">Total Reservations</p>
            <p className="text-2xl font-bold">
              {dashboardData.totalReservations}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales by Category Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Sales Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sales Distribution</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={chartData}
              dataKey="sales"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;