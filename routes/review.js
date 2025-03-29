var express = require("express");
var router = express.Router();
const { Review } = require("../models/review");

// Route to fetch all reviews
router.get("/", async function (req, res) {
  try {
    const reviews = await Review.find(); // Fetch all documents from the Review collection
    res.status(200).json(reviews); // Send the reviews as a JSON response
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Route to add a new review
router.post("/", async function (req, res) {
  try {
    const { name, rating, description } = req.body;

    // Validate input
    if (!name || !rating || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new review document
    const newReview = new Review({
      name,
      rating,
      description,
    });

    // Save the review in the database
    await newReview.save();
    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

module.exports = router;
