import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/adminlogin");
  };

  return (
    <div className="container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="dashboard-container">
        <button onClick={() => navigate("/addproduct")}>Add Product</button>
        <button onClick={() => navigate("/manageproducts")}>Manage Products</button>
        <button onClick={() => window.location.href="/manage-orders"}>
          Manage Orders
        </button>
        <button onClick={() => navigate("/manageusers")}>Manage Users</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
