import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState(""); // ✅ added
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartCount(total);
      } catch (error) {
        setCartCount(0);
      }
    };

    updateCartCount();

    const handleStorageChange = () => updateCartCount();
    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/search?q=${search}`);
  };

  return (
    <nav className="navbar">
      <div className="left">
        <h2 className="logo">Croma</h2>
        <span>☰ Menu</span>
      </div>

      <div className="center">
        <input
          type="text"
          placeholder="What are you looking for?"
          value={search} 
          onChange={(e) => setSearch(e.target.value)} // ✅ added
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(); // ✅ Enter works
          }}
        />
        <button onClick={handleSearch}>Search</button> {/* ✅ added */}
      </div>

      <div className="right">
        <span>📍 Mumbai,40049</span>
        <span>
          <a href="/profile">Profile</a>
        </span>

        <span
          onClick={() => navigate("/cart")}
          style={{ cursor: "pointer", position: "relative" }}
          title="Cart"
        >
          🛒
        </span>
      </div>
    </nav>
  );
}

export default Navbar;