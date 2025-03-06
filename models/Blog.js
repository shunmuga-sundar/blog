const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  url: {type: String},
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String },
  tags: { type: [String], default: [] }
}, { timestamps: true });


BlogSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  console.log("tt", this.title)

  this.url = this.title.replaceAll(' ', '-').toLowerCase();
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);