import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
  const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);}, []);
  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));};
  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty = (updated[index].qty || 1) + 1;
    updateCart(updated);};
  const decreaseQty = (index) => {
    const updated = [...cart];
    if ((updated[index].qty || 1) > 1) {
      updated[index].qty -= 1;}
    updateCart(updated);};
  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    updateCart(updated);};

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),0);
  return (
  <div style={{ padding: "30px" }}>
    <h2>Your Cart</h2>
     {cart.length === 0 ? (
      <p>No items in cart</p>) : (
      <>
       {cart.map((item, index) => (
        <div key={index} className="cart-item" style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name}/>
          <div>
            <p><b>{item.name}</b></p>
            <p>₹{item.price}</p>
          </div>
          <div className="qty-controls">
            <button className="qty-btn" onClick={() => decreaseQty(index)}>-</button>
            <span>{item.qty || 1}</span>
            <button className="qty-btn" onClick={() => increaseQty(index)}>+</button>
          </div>
          <button className="remove-btn" onClick={() => removeItem(index)}>Remove</button>
        </div>
        ))}
        <div className="totals">
          <h3>Total Items: {totalItems}</h3>
          <h3>Total Price: ₹{totalPrice}</h3>
          <button className="checkout-btn" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
        </div>
      </>  
      )}
    </div>
  );
};

export default Cart;
