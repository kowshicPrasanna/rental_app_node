var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { VehicleOwner } = require("../models/vehicleOwner");
const { RecordCounter } = require("../models/counter");

router.post("/register", async function (req, res) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
    // const recordCounter = await RecordCounter.findOne({
    //   type: "OWNER",
    // });
    // if (!recordCounter) {
    //   const counter = new RecordCounter({
    //     counter: 1,
    //     type: "OWNER",
    //   });
    //   await counter.save();
    //   req.body.vehicleId = "O" + 1;
    // }
    // req.body.userId = "O" + recordCounter.counter;
    //const vehicleowner = new VehicleOwner(req.body); //this gets all the info from the req  like name.... since name is matched with name
    //another method is
    const vehicleowner = new VehicleOwner({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      ownerId: req.body.ownerId,
    });
    await vehicleowner.save();
    // recordCounter.counter = recordCounter + 1;
    // await vehicleowner.save();
    return res.json({ message: "Vehicle owner registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async function (req, res) {
  try {
    const vehicleowner = await VehicleOwner.findOne({ email: req.body.email });
    if (!vehicleowner) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isValid = bcrypt.compareSync(
      req.body.password,
      vehicleowner.password
    );
    if (!isValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    //return res.json({ message : "Vehicle Owner Logged in Successfully"})
    const token = jwt.sign(
      { id: vehicleowner.ownerId },
      process.env.JWT_SECRET
    );
    return res.json({
      message: "Vehicle Owner Logged in Successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
