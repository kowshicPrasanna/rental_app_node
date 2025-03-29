const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const VehicleSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
  },
  modelYear: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  vehicleId: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  vehicleImage: { type: String },
});

// Adding auto-increment to the vehicleId field
VehicleSchema.plugin(mongooseSequence, { inc_field: "vehicleId" });

const Vehicle = mongoose.model("Vehicle", VehicleSchema);

module.exports = { Vehicle };
