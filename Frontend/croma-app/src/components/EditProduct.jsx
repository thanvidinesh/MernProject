import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AddProduct.css";


function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: ""
  });

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });

    if (res.ok) {
      alert("Updated successfully");
navigate("/manageproducts");
    } else {
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Edit Product</h2>

      <form onSubmit={handleUpdate}>
        <input name="name" value={product.name} onChange={handleChange} placeholder="Name" /><br /><br />
        <input name="price" value={product.price} onChange={handleChange} placeholder="Price" /><br /><br />
        <textarea name="description" value={product.description} onChange={handleChange} /><br /><br />
        <input name="category" value={product.category} onChange={handleChange} /><br /><br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditProduct;
