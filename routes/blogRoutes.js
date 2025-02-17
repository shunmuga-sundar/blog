const express = require("express");
const { getAllBlogs, createBlog, updateBlog, deleteBlog } = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getAllBlogs);
router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;