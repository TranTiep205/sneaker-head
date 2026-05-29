const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/auth');

// Chỉ Admin mới được upload ảnh
router.post('/', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;