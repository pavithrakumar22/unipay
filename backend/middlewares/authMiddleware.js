// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export default protect;