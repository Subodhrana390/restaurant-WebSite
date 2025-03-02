import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./Dashboard/AdminDashboard";
import CustomerDashboard from "./Customer/CustomerDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./Customer/components/Auth/ProtectedRoutes";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        theme="white"
        toastClassName="backdrop-blur-md bg-blue-900/80 text-white text-sm p-2 rounded-md shadow-md"
      />

      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<CustomerDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
