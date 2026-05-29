const cloudinary = require('../config/cloudinary');

async function uploadImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Không có file ảnh" });
        }

        console.log("File nhận được:", req.file.originalname, req.file.mimetype, req.file.size);

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "sneakerhead" },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary error chi tiết:", JSON.stringify(error, null, 2)); // ← THÊM
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(req.file.buffer);
        });

        res.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error) {
        console.error("Upload error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { uploadImage };