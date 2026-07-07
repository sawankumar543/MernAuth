import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        // Token ko cookies ya Authorization header (Bearer token) se nikala
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token found",
            });
        }

        // FIX 1: jwt.verify synchronous hota hai, isse await hata diya
        // Agar token invalid ya expire hoga, toh yeh seedhe catch block mein bhej dega
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        // FIX 2: Security ke liye password field ko database se fetch karte waqt hi exclude (-password) kar diya
        const user = await User.findById(decoded?._id).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // User data ko request object me attach kiya taaki aage ke routes use kar sakein
        req.user = user;
        next();
        
    } catch (error) {
        console.error("Auth Middleware Error: ", error.message);
        
        // FIX 3: Agar token expire ho gaya ho toh user ko specific message dena behtar hai
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token has expired"
            });
        }

        return res.status(401).json({ // Status 401 (Unauthorized) code validation errors ke liye perfect hai
            success: false,
            message: "Unauthorized: Invalid Token"
        });
    }
};

export default authMiddleware;
