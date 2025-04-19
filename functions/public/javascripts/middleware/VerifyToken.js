// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "No token provided" 
            });
        }

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Attach user data ke request
        req.user = {
            uid: decoded.data.idRequest, // ID dari response login
            email: decoded.data.email,
            role: decoded.data.role.role,
            fcmToken: decoded.data.fcmToken
        };
        
        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false,
            message: "Invalid or expired token",
            error: err.message 
        });
    }
};

module.exports = authenticateUser;