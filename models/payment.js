const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const PaymentSchema = new mongoose.Schema({
  oid: {
    type: Number,
    unique: true,
  },
  orderId: { type: String, required: true },
  paymentId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  receipt: { type: String },
  status: { type: String, default: "created" },
  createdAt: { type: Date, default: Date.now },
});

PaymentSchema.plugin(mongooseSequence, { inc_field: "oid" });

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = {Payment};
