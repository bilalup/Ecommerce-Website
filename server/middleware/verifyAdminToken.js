import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const verifyAdminToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized1' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}