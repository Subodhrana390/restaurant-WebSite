import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import DashboardHome from "./components/DashboardHome";
import EmployeeList from "./components/Employee/EmployeeList";
import AddEmployee from "./components/Employee/component/AddEmployee";
import UpdateEmployee from "./components/Employee/component/UpdateEmployee";
import MenuList from "./components/menu/MenuList";
import AddDish from "./components/menu/component/AddDish";
import UpdateDish from "./components/menu/component/UpdateDish";
import TableList from "./components/table/TableList";
import AddTable from "./components/table/component/AddTable";
import UpdateTable from "./components/table/component/UpdateTable";
import Profile from "./components/Profile/Profile";
import ReservationList from "./components/reservation/ReservationList";
import ViewReservation from "./components/reservation/component/ViewReservation";
import CustomerList from "./components/Customer/CustomerList";
import ViewCustomer from "./components/Customer/ViewCustomer";
import OrdersList from "./components/order/OrdersList";
import Login from "./components/Auth/Login";
import AdminProtectedRoutes from "./AdminProtectedRoutes";
import ViewEmployee from "./components/Employee/component/ViewEmployee";

const AdminDashboard = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<AdminProtectedRoutes />}>
        <Route
          element={<AdminLayout />} // Apply AdminLayout to all nested routes
        >
          <Route path="/" element={<DashboardHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/edit/:id" element={<UpdateEmployee />} />
          <Route path="/employees/view/:id" element={<ViewEmployee />} />
          <Route path="/menu" element={<MenuList />} />
          <Route path="/menu/add" element={<AddDish />} />
          <Route path="/menu/edit/:id" element={<UpdateDish />} />
          <Route path="/tables" element={<TableList />} />
          <Route path="/tables/add" element={<AddTable />} />
          <Route path="/tables/edit/:id" element={<UpdateTable />} />
          <Route path="/reservations" element={<ReservationList />} />
          <Route path="/reservations/view/:id" element={<ViewReservation />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/view/:id" element={<ViewCustomer />} />
          <Route path="/orders" element={<OrdersList />} />
        </Route>
      </Route>

      {/* 404 Not Found Route */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default AdminDashboard;