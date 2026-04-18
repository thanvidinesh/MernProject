import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Search.css";

function Search() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
  fetch("/api/products")
  .then(res => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    setProducts(data);
    setError(null);
  })
  .catch(err => {
    console.error('Fetch products error:', err);
    setError(err.message);
  })
  .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(product =>
  `${product.name} ${product.category || ''} ${product.description || ''}`.toLowerCase().includes(query.toLowerCase())
  );
  const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find(item => item._id === product._id);
  if (existing) {
  existing.qty += 1;
  } else {
  cart.push({ ...product, qty: 1 });}
localStorage.setItem("cart", JSON.stringify(cart));
alert("Added to cart!");};
if (loading) {
return <div className="search-container"><h2 className="loading">Loading products...</h2></div>;}
return (
<div className="search-container">
<h2>Search Results for "{query}" ({filteredProducts.length})</h2>
{error ? (<p className="error">Error: {error}</p>
  ) : filteredProducts.length === 0 ? (<p>No products found for "{query}"</p>) : (
<div className="search-grid">
{filteredProducts.map((item) => (
<Link to={`/product/${item._id}`} className="search-link" key={item._id}>
<div className="search-card">
<img src={item.image ? `/uploads/${item.image}` : '/vite.svg'} alt={item.name} />
<h4>{item.name}</h4>
<p>₹{item.price}</p>
<small>{item.category}</small>
<p className="description">{item.description?.substring(0, 80)}...</p>
<button onClick={(e) => { e.preventDefault(); addToCart(item); }}>Add to Cart</button>
</div>
  </Link>))}</div>)}
</div>
  );
}
export default Search;
