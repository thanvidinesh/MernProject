import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
const script = document.createElement("script");
script.src = "https://checkout.razorpay.com/v1/checkout.js";
script.onload = () => {
resolve(true);
};
script.onerror = () => resolve(false);
document.body.appendChild(script);
  });
};

function Payment() {
const location = useLocation();
const navigate = useNavigate();
const [cart, setCart] = useState([]);
const [loading, setLoading] = useState(false);
const [shipping, setShipping] = useState({ address: '', phone: '', email: '' });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);

    if (location.state?.shipping) {
      setShipping(location.state.shipping);
    }
  }, [location.state]);

const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const placeOrderWithRazorpay = async () => {
    setLoading(true);
    try {
   
      const orderResponse = await fetch("http://localhost:5000/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "INR", cart, totalQty })
      });

      const order = await orderResponse.json();

      if (!order.id) {
        alert("Failed to create order");
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

        const options = {
        key: "rzp_test_SeBSYsw7z1hemk",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Croma Store",
        prefill: {
          name: "Customer",
          email: shipping.email || "customer@example.com",
          contact: shipping.phone || "9999999999"
        },
        method: {
          upi: true
        },
        handler: async (response) => {
          const verifyResponse = await fetch("http://localhost:5000/save-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cart,
              total,
              totalQty,
              user: {
                name: "Customer",
                email: shipping.email || "customer@example.com",
                phone: shipping.phone || "9999999999"
              },
              shipping,
              paymentMethod: "UPI",
              paymentId: response.razorpay_payment_id
            })
          });

          if (verifyResponse.ok) {
            alert("✅ Payment Successful! Order placed.");
            localStorage.removeItem("cart");
            navigate("/");
          } else {
            alert("❌ Payment verification failed");
          }
        }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("❌ Payment initiation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div style={{ padding: "30px", textAlign: "center" }}><h2>Cart is empty</h2><button onClick={() => navigate("/cart")}>Go to Cart</button></div>;
  }

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🛒 Secure Payment</h2>
      <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <p><strong>Items:</strong> {totalQty}</p>
        <p><strong>Total:</strong> ₹{total.toFixed(2)}</p>
        {shipping.address && (
          <p><strong>Shipping:</strong> {shipping.address.slice(0,50)}...</p>
        )}
      </div>
      <button 
        onClick={placeOrderWithRazorpay} 
        disabled={loading}
        style={{
          padding: "18px 40px",
          background: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "20px",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
          boxShadow: "0 4px 12px rgba(66,133,244,0.3)"
        }}
      >
        {loading ? "⏳ Processing..." : `💳 Pay ₹${total.toFixed(2)} with Razorpay`}
      </button>
      <p style={{ marginTop: "15px", fontSize: "14px", color: "#666", textAlign: "center" }}>
        🔒 Secure • Test Mode • Backend: localhost:5000
      </p>
    </div>
  );
}

export default Payment;
