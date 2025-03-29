const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: Number,
    unique: true,
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  modelName: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  location: { type: String, required: true },
  vehicleId: { type: Number, required: true },
  rentalDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentId: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

BookingSchema.plugin(mongooseSequence, { inc_field: "bookingId" });

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = {Booking};
