const jwt = require('jsonwebtoken');

exports.generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);