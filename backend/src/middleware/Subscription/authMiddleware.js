const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');

const authMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        
        if (!authorization) {
            return res.status(401).json({ message: 'Authorization token required' });
        }

        // Extract token from "Bearer <token>"
        const token = authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Find user and attach to request object
        req.user = await User.findById(decoded._id);

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
