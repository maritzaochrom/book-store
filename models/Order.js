const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  book: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Order", OrderSchema);
