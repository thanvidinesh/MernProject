import React, { useEffect, useState } from "react";
import "./ProductDetails.css";
import { useParams } from "react-router-dom";

function ProductDetails() {

  const { id } = useParams();

const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

  useEffect(() => {
  setLoading(true);
fetch(`/api/products/${id}`)
  .then(res => {
     if (!res.ok) throw new Error(`HTTP ${res.status}`);
     return res.json();
   })
  .then(data => {
    console.log('Product data:', data);
    setProduct(data);
   })
  .catch(err => {
    console.error('Fetch error:', err);
    setError(err.message);
  })
  .finally(() => setLoading(false));
  }, [id]);

  return (
 <div className="product-page">
  {loading ? (
  <div className="product-card">
  <h2>Loading...</h2>
  </div>
  ) : error ? (
  <div className="product-card">
  <h2>Error: {error}</h2>
  <p>No product found. Try from home page.</p>
  </div>
  ) : product ? (
  <div className="product-card">
      <h2>Product Details</h2>
      <div className="product-image">
<img 
          src={product.image ? `http://localhost:5000/uploads/${product.image}` : 'https://via.placeholder.com/400x300/007bff/ffffff?text=Product+Image'}
          alt={product.name}
        />
      </div>
      <div className="product-info">
        <p><b>Name:</b> {product.name}</p>
        <p><b>Price:</b> ₹ {product.price}</p>
        <p><b>Description:</b> {product.description}</p>
        <p><b>Category:</b> {product.category}</p>
      </div>
      <button className="productbtn" onClick={() => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
       
        const existingIndex = cart.findIndex(item => item._id === product._id);
        if (existingIndex >= 0) {
         
          cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
          alert("Item quantity increased!");
        } else {
          
          product.qty = 1;
          cart.push(product);
          alert("Added to cart!");
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
      }}>Add to Cart</button>
  </div>
  ) : (
  <div className="product-card">
  <h2>No product data</h2>
    </div>
  )}
 </div>
  );
}

export default ProductDetails;