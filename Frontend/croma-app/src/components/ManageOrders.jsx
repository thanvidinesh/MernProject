import React, { useState, useEffect } from "react";
import "./ManageOrders.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
fetch("http://localhost:5000/orders")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => {
        console.log("Error fetching orders:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, newStatus = "Delivered") => {
    try {
fetch(`http://localhost:5000/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });
      // Optimistic update
      setOrders(orders.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="orders-container"><h2>Loading orders...</h2></div>;
  if (error) return <div className="orders-container"><h2>Error: {error}</h2></div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">Manage Orders ({orders.length})</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <span className="order-id">#{order._id.slice(-6)}</span>
              <span className="order-amount">₹{order.totalAmount}</span>
            </div>

            <div className="order-info">
              <p><b>Email:</b> {order.user?.email || 'N/A'}</p>
              <p><b>Phone:</b> {order.user?.phone || 'N/A'}</p>
              <p><b>Qty:</b> {order.totalQty}</p>
              <p><b>Payment:</b> {order.paymentMethod || 'N/A'}</p>
            </div>

            <div className="items">
              <h4>Items ({order.items.length})</h4>
              {order.items.map((item, i) => (
                <div className="item" key={i}>
                  <span>{item.name}</span>
                  <span>₹{item.price} × {item.qty}</span>
                </div>
              ))}
            </div>
            
            <div className="order-footer">
              <span className="status status-pending">{order.status || 'Pending'}</span>
              <button 
                className="status-btn" 
                onClick={() => updateStatus(order._id, "Delivered")}
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageOrders;

