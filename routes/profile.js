const express = require("express");
var router = express.Router();
const {authorizer} = require("../lib/authorizer");

router.get("/profile", authorizer, (req, res) => {
    res.json({
      message: "Profile data retrieved successfully",
      user: req.user // Returns { id, email, role }
    });
  });

  module.exports = router;