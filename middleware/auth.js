const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Không có token, vui lòng đăng nhập' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔑 Decoded token:", decoded);   // Debug

        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User không tồn tại' });
        }

        console.log("👤 User role:", req.user.role);
        next();
    } catch (error) {
        console.error("JWT verify error:", error.message);
        return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && String(req.user.role).toLowerCase() === 'admin') {
        next();
    } else {
        console.log("⛔ Không phải admin, role =", req.user?.role);
        return res.status(403).json({ success: false, message: 'Chỉ Admin mới có quyền thực hiện' });
    }
};

module.exports = { protect, adminOnly };