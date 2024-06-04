const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    console.log("Middleware authentication")
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.log("No token")
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
