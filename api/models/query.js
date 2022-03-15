const mongoose = require("mongoose");

const querySchema = mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Query", querySchema);
