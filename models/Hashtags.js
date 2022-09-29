const mongoose = require("mongoose");

const HashtagsSchema = new mongoose.Schema({
  hashtag: {
    type: String,
    unique: true,
    trim: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("hashtag", HashtagsSchema);
