const mongoose = require("mongoose");

const VehicleOwnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
});

const VehicleOwner = mongoose.model("VehicleOwner", VehicleOwnerSchema);

module.exports = {VehicleOwner};

