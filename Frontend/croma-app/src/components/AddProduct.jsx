import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();   
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null
  });               

  const categories = [
    "Washing Machines",   
    "Speakers", 
    "Microwaves",
    "Vacuum",
    "Wearables",
    "Cameras",
    "Heaters",
    "Geysers"
  ];

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.image) {
      alert("Please fill all fields and select an image.");
      return;
    }
    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", Number(formData.price));
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("image", formData.image);

    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: data
      });

      if (res.ok) {
        alert("Product added successfully!");
        setFormData({
          name: "",
          price: "",
          description: "",
          category: "",
          image: null
        });
        setImagePreview(null);
        navigate("/admindashboard");
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      alert("Error adding product. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Product Name </label>
            <input 
              name="name" 
              placeholder="Product Name" 
              value={formData.name}  
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <label>Price </label>
            <input 
              name="price"  
              type="number"
              placeholder="Price" 
              value={formData.price} 
              onChange={handleChange}
              required 
            />
          </div>
          <div>
            <label>Description </label>
            <textarea 
              name="description" 
              placeholder="Description" 
              value={formData.description} 
              onChange={handleChange}
              rows="3"
              required 
            />
          </div>
          <div>
            <label>Category </label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Product Image *</label>
            <input 
              type="file" 
              name="image" 
              accept="image/*"
              onChange={handleChange} 
              required 
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px'}} />
              </div>
            )}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
