import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = () => {
    if (email === "admin@test.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      alert("Admin login successful!");
      navigate("/admindashboard");
    } else {
      alert("Wrong credentials. Try admin@test.com / admin123");
    }
  };

  return (
    <div className="overlay">
      <div className="popup">
        <span >Admin Login</span>
        <div className="input-box">
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
