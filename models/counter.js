const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: String,
  value: Number,
});

const Counter = mongoose.model("Counter", CounterSchema);
module.exports = { Counter };
