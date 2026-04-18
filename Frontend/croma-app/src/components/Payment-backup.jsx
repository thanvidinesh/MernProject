import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.razorpay) {
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

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const placeOrderWithRazorpay = async () => {
    setLoading(true);
    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch("http://localhost:5000/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: "INR", cart, totalQty }) // paise
      });

      const order = await orderResponse.json();

      if (!order.id) {
        alert("Failed to create order");
        return;
      }

      // Step 2: Load Razorpay script
      await loadRazorpayScript();

      // Step 3: Open Razorpay checkout
      const options = {
        key: "rzp_test_1DP5mmOlF3G5Y5", // Replace with your key
        amount: order.amount,
        currency: order.currency,
        name: "Croma Store",
        description: "Order Payment",
        order_id: order.id,
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999"
        },
        handler: async (response) => {
          // Step 4: Verify payment on backend
          const verifyResponse = await fetch("http://localhost:5000/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              cart, total, totalQty
            })
          });

          if (verifyResponse.ok) {
            alert("Payment Successful! Order placed.");
            localStorage.removeItem("cart");
            navigate("/");
          } else {
            alert("Payment verification failed");
          }
        },
        theme: {
          color: "#3399cc"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Payment</h2>
      <p>Total Items: {totalQty}</p>
      <p>Total Amount: ₹{total}</p>
      <button 
        onClick={placeOrderWithRazorpay} 
        disabled={loading || cart.length === 0}
        style={{
          padding: "15px 30px",
          background: "#ff6b35",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "18px",
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%"
        }}
      >
        {loading ? "Processing..." : "Pay with Razorpay"}
      </button>
      <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        Note: Backend needs /create-razorpay-order and /verify-payment endpoints with your Razorpay keys.
        Test key used: rzp_test_1DP5mmOlF3G5Y5 (replace).
      </p>
    </div>
  );
}

export default Payment;

