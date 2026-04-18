import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductList({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        setProducts(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedCategory]);

  const addToCart = (product, e) => {
    e.stopPropagation();
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const i = cart.findIndex((x) => x._id === product._id);
    i !== -1 ? (cart[i].qty = (cart[i].qty || 1) + 1) : cart.push({ ...product, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(i !== -1 ? "Quantity updated" : "Added to cart");
  };

  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (error) return <h2 style={{ textAlign: "center" }}>Error: {error}</h2>;

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
    cursor: "pointer",
    background: "#fff",
  };

  const btnStyle = {
    padding: "8px 12px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>
        {selectedCategory || "All Products"}
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
        gap: 20,
        marginTop: 20
      }}>
        {filtered.length ? filtered.map((p) => (
          <div key={p._id} style={cardStyle} onClick={() => navigate(`/product/${p._id}`)}>
            <img
              src={p.image ? `http://localhost:5000/uploads/${p.image}` : "https://via.placeholder.com/300"}
              alt={p.name}
              style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8 }}
            />
            <h3>{p.name}</h3>
            <p>₹ {p.price}</p>
            <button style={btnStyle} onClick={(e) => addToCart(p, e)}>
              Add to Cart
            </button>
          </div>
        )) : <p>No products found</p>}
      </div>
    </div>
  );
}

export default ProductList;