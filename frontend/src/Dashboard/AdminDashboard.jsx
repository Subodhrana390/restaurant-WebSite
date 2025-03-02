import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import DashboardHome from "./components/DashboardHome";
import EmployeeList from "./components/Employee/EmployeeList";
import AddEmployee from "./components/Employee/component/AddEmployee";
import UpdateEmployee from "./components/Employee/component/UpdateEmployee";
import ViewEmployee from "./components/Employee/component/viewEmployee";
import MenuList from "./components/menu/MenuList";
import AddDish from "./components/menu/component/AddDish";
import UpdateDish from "./components/menu/component/UpdateDish";
import TableList from "./components/table/TableList";
import AddTable from "./components/table/component/AddTable";
import UpdateTable from "./components/table/component/updateTable";
import Profile from "./components/Profile/Profile";
import ReservationList from "./components/reservation/ReservationList";
import ViewReservation from "./components/reservation/component/viewReservation";
import CustomerList from "./components/Customer/CustomerList";
import ViewCustomer from "./components/Customer/viewCustomer";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/menu" element={<MenuList />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/view/:id" element={<ViewCustomer />} />
        <Route path="/reservations" element={<ReservationList />} />
        <Route path="/tables" element={<TableList />} />
        <Route path="/employees/add" element={<AddEmployee />} />
        <Route path="/employees/edit/:id" element={<UpdateEmployee />} />
        <Route path="/employees/edit/:id" element={<UpdateEmployee />} />
        <Route path="/employees/view/:id" element={<ViewEmployee />} />
        <Route path="/menu/add" element={<AddDish />} />
        <Route path="/menu/edit/:id" element={<UpdateDish />} />
        <Route path="/tables/add" element={<AddTable />} />
        <Route path="/tables/edit/:id" element={<UpdateTable />} />
        <Route path="/reservations/view/:id" element={<ViewReservation />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
