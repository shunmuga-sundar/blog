const express = require("express");
const multer = require("multer");
const path = require("path");
const { getAllBlogs, createBlog, updateBlog, deleteBlog, getBlog } = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Folder to store images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    },
  });
  // Multer upload middleware
const upload = multer({ storage });

router.get("/", getAllBlogs);
router.post("/", authMiddleware, upload.single("image"), createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.get("/:id", authMiddleware, getBlog);

// Serve uploaded images statically
router.use("/uploads", express.static("uploads"));

module.exports = router;