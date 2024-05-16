const jwt = require('jsonwebtoken');

function generateToken(payload) {
    return jwt.sign(payload, 'rabbit_mq', { expiresIn: '1h' });
}
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
    }

    jwt.verify(token, 'rabbit_mq', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

module.exports = { generateToken, verifyToken };