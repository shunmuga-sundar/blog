const Blog = require("../models/Blog");
const path = require("path");
const fs = require("fs");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort([['createdAt', -1]]).populate("author", "username");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const author = req.user.id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const newBlog = new Blog({ title, content, author, tags: tags ? tags.split(",").map(tag => tag.trim()) : [], image: imagePath });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    let updateData = { title, content };

    // Convert tags to an array if provided
    if (tags) {
      updateData.tags = tags.split(",").map(tag => tag.trim());
    }
    // Find the existing blog
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Handle image update
    if (req.file) {
      const newImagePath = `/uploads/${req.file.filename}`;

      // Delete the old image if it exists
      if (existingBlog.image) {
        const oldImagePath = path.join(__dirname, "../uploads/", existingBlog.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }

      updateData.image = newImagePath;
    }

    console.log(updateData)

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      url: req.params.id
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}