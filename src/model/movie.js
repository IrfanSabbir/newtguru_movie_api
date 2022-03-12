const mongoose = require('mongoose');
const Schema = mongoose.Schema
const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      default: null,
    },
    released: {
      type: String,
      default: null
    },
    director: {
      type: String,
      default: null
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
