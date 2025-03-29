const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const {Payment} = require("../models/payment");
const {Booking} = require("../models/booking");

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Use environment variable
  key_secret: process.env.RAZORPAY_SECRET,
});

// 🟢 1. Create an Order API
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    });

    await payment.save();
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
//pay_Q8hTrAe7SdbGNp
router.post("/verify-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = req.body;
  
      // 🔹 Step 1: Verify Payment Signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body)
        .digest("hex");
  
      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Payment verification failed" });
      }
  
      // 🔹 Step 2: Update Payment Collection
      const paymentUpdate = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id }, // Find payment by order ID
        { paymentId: razorpay_payment_id, status: "Paid" }, // Update payment ID & status
        { new: true }
      );
  
      if (!paymentUpdate) {
        return res.status(404).json({ success: false, message: "Payment record not found" });
      }
  
      // 🔹 Step 3: Store Booking in Booking Collection
      const newBooking = new Booking({
        userName: bookingDetails.userName,
        userEmail: bookingDetails.userEmail,
        userPhone: bookingDetails.userPhone,
        modelName: bookingDetails.modelName,
        vehicleType:bookingDetails.vehicleType,
        vehicleNumber:bookingDetails.vehicleNumber,
        location:bookingDetails.location,
        vehicleId:bookingDetails.vehicleId,
        rentalDate:bookingDetails.rentalDate,
        returnDate:bookingDetails.returnDate,
        totalPrice: bookingDetails.totalPrice,
        totalDays: bookingDetails.totalDays,
        paymentId: razorpay_payment_id,
        paymentStatus: "Paid",
        createdAt: new Date(),
      });
  
      await newBooking.save();
  
      res.json({ success: true, message: "Payment verified, booking confirmed." });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
// 2. Verify Payment API
// router.post("/verify-payment", async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature === razorpay_signature) {
//       res.json({ success: true, message: "Payment verified successfully" });
//     } else {
//       res
//         .status(400)
//         .json({ success: false, message: "Payment verification failed" });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

module.exports = router;
