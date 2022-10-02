const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },

    hashtags: {
      type: [String],
      ref: "Hashtags",
    },

    foodItems: {
      type: [String],
      enum: {
        values: ["pizza", "burger", "toast"],
        message: "Please choose given food items only",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meal", MealSchema);
