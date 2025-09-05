import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(200).json({ 
                isAuthenticated: false,
                user: null,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId)
            .select('-password -__v');
        
        if (!user) {
            res.clearCookie('token');
            return res.status(200).json({
                isAuthenticated: false,
                user: null,
                message: "User not found"
            });
        }

        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin || false
        };

        next();
    } catch (error) {
        res.clearCookie('token');
        
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "Token expired"
            });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "Invalid token"
            });
        }

        console.error('Authentication error:', error);
        res.status(500).json({
            isAuthenticated: false,
            message: "Authentication failed"
        });
    }
};