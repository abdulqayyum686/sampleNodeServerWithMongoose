const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  taskName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "incomplete",
  },
  taskType: {
    type: String,
    default: "Academic",
  },
  subTasks: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Tasks", taskSchema);
