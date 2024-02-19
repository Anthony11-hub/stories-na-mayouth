require("dotenv").config();
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productTitle: {
    type: String,
  },
  productDescription: {
    type: String,
  },
  productPrice: {
    type: Number,
  },
  productCategory: {
    type: String,
  },
  productImage: {
    type: [String],
  },
  productBrand: {
    type: String,
  },
  productCondition: {
    type: String,
  },
  productAvailability: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
