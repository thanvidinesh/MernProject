const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  items: [mongoose.Schema.Types.Mixed],
  totalAmount: { type: Number, required: true },
  totalQty: { type: Number, required: true },
  user: { type: String, required: true },
  paymentMethod: { type: String },
  paymentId: { type: String },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });
module.exports = mongoose.model("Order", orderSchema);
