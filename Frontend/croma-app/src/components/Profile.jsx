import { useEffect, useState } from "react";
function Profile() {
const [user, setUser] = useState(null);
const [orders, setOrders] = useState([]);
useEffect(() => {
const storedUser = JSON.parse(localStorage.getItem("user"));
setUser(storedUser);
fetch("http://localhost:5000/orders")
.then(res => res.json())
.then(data => {
const myOrders = data.filter(
order => order.user?.email === storedUser?.email
);
setOrders(myOrders);});
  }, []);
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  if (!user) return <h2>Please login</h2>;
  return (
    <div style={{ padding: "20px" }}>
      <h2>My Profile</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <button onClick={logout}>Logout</button>
<h3>My Orders</h3>
{orders.length === 0 ? (
<p>No orders</p>) : (
orders.map((order, index) => (
     <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
     <p>Order ID: {order._id}</p>
     <p>Total: ₹{order.totalAmount}</p>
</div>
))
 )}
</div>
  );
}

export default Profile;

