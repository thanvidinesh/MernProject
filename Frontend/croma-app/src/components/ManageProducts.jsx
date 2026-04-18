import React, { useEffect, useState } from "react";
import "./ManageProducts.css";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [failedImages, setFailedImages] = useState(new Set());
  const placeholderImage = 'https://via.placeholder.com/80x80/eee/666?text=No+Image';

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
  .then(data => setProducts(data));
  }, []);

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Delete this product?");
  if (!confirmDelete) return;
const res = await fetch(`http://localhost:5000/products/${id}`, {
  method: "DELETE"
    });

    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
    } else {
      alert("Delete failed");
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/editproduct/${id}`;
  };

  return (
    <div style={{ padding: "30px" }}>
    <h2>Manage Products</h2>
{products.length === 0 ? (
      <p>No products found. Add some products first.</p>
    ) : (
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
        <thead>
          <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Description</th>
          <th>Category</th>
          <th>Actions</th>
         </tr>
      </thead>

      <tbody>
         {products.map((p) => (
          <tr key={p._id}>
             <td>
<img
                src={failedImages.has(p._id) ? placeholderImage : `http://localhost:5000/uploads/${p.image}`}
                width="60"
                height="60"
                style={{ objectFit: "cover" }}
                alt={p.name}
                onError={() => setFailedImages(prev => new Set([...prev, p._id]))}
                onLoad={() => setFailedImages(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(p._id);
                  return newSet;
                })}
              />
            </td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.description}</td>
              <td>{p.category}</td>
              <td>
                <button onClick={() => handleEdit(p._id)}>Edit</button>
                <button onClick={() => handleDelete(p._id)} style={{ marginLeft: "10px" }}>
                  Delete
                </button>
              </td>
            </tr>
           ))}
        </tbody>
      </table>
    )}
  </div>
);
}

export default ManageProducts;
