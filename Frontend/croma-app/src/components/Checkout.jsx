import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }
    if (!address.trim() || !phone.trim() || !email.trim()) {
      setError("Please fill all shipping details");
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        cart,
        totalQty,
        totalPrice,
        shipping: {
          address: address.trim(),
          phone: phone.trim(),
          email: email.trim()
        },
        payment: {
          method: "cod"
        }
      };

      const res = await fetch("http://localhost:5000/createorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/");
      } else {
        const errorData = await res.text();
        throw new Error(`Order failed: ${res.status} - ${errorData}`);
      }
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Failed to place order. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const itemStyle = {
    border: "1px solid #ccc",
    marginBottom: "10px",
    padding: "15px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "15px"
  };

  const formStyle = {
    display: "grid",
    gap: "15px",
    maxWidth: "400px",
    margin: "20px 0"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px"
  };

  const btnStyle = {
    padding: "12px 24px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%"
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Checkout</h2>
      
      {cart.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>Cart is empty</p>
      ) : (
        <>
          {/* Cart Items */}
          <div>
            <h3>Order Summary</h3>
            {cart.map((item, index) => (
              <div key={index} style={itemStyle}>
                <img 
                  src={`http://localhost:5000/uploads/${item.image}`} 
                  width="80" 
                  height="80"
                  style={{ borderRadius: "4px", objectFit: "cover" }}
                  alt={item.name}
                />
                <div style={{ flex: 1 }}>
                  <p><strong>{item.name}</strong></p>
                  <p>₹{item.price} × {item.qty || 1}</p>
                </div>
              </div>
            ))}
            <div style={{ 
              background: "#f8f9fa", 
              padding: "15px", 
              borderRadius: "8px", 
              marginTop: "15px",
              fontWeight: "bold"
            }}>
              <p>Total Items: {totalQty}</p>
              <p>Total Price: ₹{totalPrice}</p>
            </div>
          </div>

          {/* Shipping Form */}
          <div>
            <h3>Shipping Information</h3>
            {error && (
              <div style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "15px"
              }}>
                {error}
              </div>
            )}
            <div style={formStyle}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Full Address *
                </label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete shipping address"
                  style={{ ...inputStyle, height: "80px", resize: "vertical" }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Phone Number *
                </label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Email *
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment: COD only */}
          <div style={{ margin: "20px 0", padding: "15px", background: "#d4edda", borderRadius: "8px" }}>
            <h3 style={{ color: "#155724" }}>Payment Method: Cash on Delivery (COD)</h3>
            <p style={{ color: "#155724" }}>Pay when your order is delivered!</p>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={loading || cart.length === 0}
            style={{
              ...btnStyle,
              opacity: loading || cart.length === 0 ? 0.6 : 1,
              cursor: loading || cart.length === 0 ? "not-allowed" : "pointer",
              marginBottom: "10px"
            }}
          >
            {loading ? "Placing Order..." : "Place Order (COD)"}
          </button>
          <button 
            onClick={() => navigate("/payment", { state: { cart, shipping: { address, phone, email } } })}
            disabled={cart.length === 0 || !address.trim() || !phone.trim() || !email.trim()}
            style={{
              ...btnStyle,
              background: "#4285f4",
              opacity: cart.length === 0 || !address.trim() || !phone.trim() || !email.trim() ? 0.6 : 1,
              cursor: cart.length === 0 || !address.trim() || !phone.trim() || !email.trim() ? "not-allowed" : "pointer"
            }}
          >
            Pay with Razorpay
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;

