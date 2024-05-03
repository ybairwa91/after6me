const mongoose = require("mongoose");

const tourrSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tourr must have a name"],
    unique: true,
    trim: true,
    maxLength: [40, "a tourr name  must have less or equal than 40 characters"],
    minLength: [10, "A tour name must have more or equal then 10 characters"],
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a difficulty"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either:easy,medium or difficult",
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "Discount price ({value}) should be below regular price",
    },
  },
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDate: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  },
});

const Tourr = mongoose.model("Tourr", tourrSchema);

module.exports = Tourr;
