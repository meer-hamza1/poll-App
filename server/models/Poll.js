const mongoose = require("mongoose")

const optionSchema = new mongoose.Schema({
  text: String,
  votes: {
    type: Number,
    default: 0
  }
})

const questionSchema = new mongoose.Schema({
  question: String,
  required: Boolean,
  options: [String]
})

const pollSchema = new mongoose.Schema({
  title: String,

  questions: [questionSchema],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  expiresAt: {
  type: Date,
  required: true,
},

  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("Poll", pollSchema)