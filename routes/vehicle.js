var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
const { Vehicle } = require("../models/vehicle");
const { Booking } = require("../models/booking");
const { authorizer } = require("../lib/authorizer");

// Fetch vehicles owned by the logged-in owner
router.get("/list", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    console.log("Received Email:", email);
    const vehicles = await Vehicle.find({ email });

    if (!vehicles.length) {
      return res.status(404).json({ message: "No vehicles found" });
    }

    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//delete vehicle
router.delete("/delete", async (req, res) => {
  try {
    const { vehicleId } = req.query;
    if (!vehicleId) {
      return res.status(400).json({ message: "vehicleId is required" });
    }
    console.log("Received vehicleId:", vehicleId);
    const deletedVehicle = await Vehicle.findOneAndDelete({ vehicleId });
    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res
      .status(200)
      .json({ message: "Vehicle deleted successfully", deletedVehicle });
  } catch (error) {
    console.error("Error deleting  vehicles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Configure Multer for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Images stored in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });
// Updated Route to add a vehicle with image upload
router.post("/add", upload.single("vehicleImage"), async function (req, res) {
  try {
    console.log("Starting to save vehicle data...");

    const { modelName, modelYear, vehicleType, vehicleNumber, location, email, price } = req.body;
    const vehicleImage = req.file ? req.file.filename : null; // Store image filename

    const vehicle = new Vehicle({
      modelName,
      modelYear,
      vehicleType,
      vehicleNumber,
      location,
      email,
      price,
      vehicleImage,
    });

    await vehicle.save();

    console.log("Vehicle data saved successfully.");
    return res.json({ message: "Vehicle Added", vehicle });
  } catch (error) {
    console.error("Error saving vehicle:", error);
    return res
      .status(500)
      .json({ message: "Error adding vehicle", error: error.message });
  }
});

router.get("/searchvehicles", async function (req, res) {
  try {
    const { from, to, type,location } = req.query;

    // Convert dates to a comparable format (assuming DD/MM/YYYY format in DB)
    const fromDate = new Date(from.split("/").reverse().join("-"));
    const toDate = new Date(to.split("/").reverse().join("-"));

    // Find booked vehicles within the given date range
    const bookedVehicles = await Booking.find({
      $or: [
        {
          rentalDate: { $lte: toDate.toISOString().split("T")[0] },
          returnDate: { $gte: fromDate.toISOString().split("T")[0] },
        },
      ],
      location: location,
    }).distinct("vehicleId");

    // Get available vehicles that are NOT in the booked list
    const availableVehicles = await Vehicle.find({
      vehicleId: { $nin: bookedVehicles },
      vehicleType: type,
      location: location, 
    });

    res.json(availableVehicles);
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    res
      .status(500)
      .json({ message: "Error retrieving vehicles", error: error.message });
  }
});

// Update vehicle details
router.put("/update-vehicle", async (req, res) => {
  try {
    const { vehicleId, modelName, modelYear, vehicleType, vehicleNumber, location, price } = req.body;

    // Validate input
    if (!vehicleId) {
      return res.status(400).json({ error: "Vehicle ID is required." });
    }

    // Find and update vehicle
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { vehicleId },
      { modelName, modelYear, vehicleType,vehicleNumber, location, price },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    res.status(200).json({ message: "Vehicle updated successfully!", updatedVehicle });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
