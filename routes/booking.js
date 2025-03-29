const express = require("express");
var router = express.Router();
const { Booking } = require("../models/booking");

router.get("/history", async (req, res) => {
  const { email } = req.query;
  try {
    const bookings = await Booking.find({ userEmail: email });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Get bookings by email (filter active/upcoming bookings)
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Convert current date to midnight (00:00:00) to compare correctly
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of the day

    console.log("Email:", email);
    console.log("Current Date:", currentDate.toISOString());

    // Find active/upcoming bookings based on rentalDate (pickup date)
    const bookings = await Booking.find({
      userEmail: email, // Ensure it matches your schema's `userEmail`
      rentalDate: { $gte: currentDate }, // Compare only the date
    }).sort({ rentalDate: 1 });

    console.log("Bookings Found:", bookings);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//delete booking
router.delete("/cancel", async (req, res) => {
  try {
    const { bookingId } = req.query;
    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }
    console.log("Received bookingId:", bookingId);
    const deletedBooking = await Booking.findOneAndDelete({ bookingId });
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res
      .status(200)
      .json({ message: "Booking cancelled successfully", deletedBooking });
  } catch (error) {
    console.error("Error cancelling  booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
