
const jwt = require('jsonwebtoken');

// Middleware to verify if the user is logged in and check their role
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        // 1. Get the token from the request header
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).json({ error: "Access denied. No authorization header provided." });
        }

        // Standard token structure is: "Bearer <token>"
        // .trim() handles unexpected trailing/leading whitespaces smoothly
        const token = authHeader.split(' ')[1]?.trim();

        if (!token || token === 'null' || token === 'undefined') {
            return res.status(401).json({ error: "Access denied. Token is missing or invalid." });
        }

        try {
            // 2. Decode and verify the token using our secret key
            // process.env.JWT_SECRET must match with what you used during registration/login sign token
            const secretKey = process.env.JWT_SECRET || 'your_fallback_secret_key_here';
            
            const verified = jwt.verify(token, secretKey);
            req.user = verified; // Stores { id: "...", role: "..." } into request context

            // 3. Check if the user's role is allowed to access this action
            if (allowedRoles && allowedRoles.length > 0) {
                if (!allowedRoles.includes(req.user.role)) {
                    return res.status(403).json({ 
                        error: `Access forbidden. Role '${req.user.role}' does not have enough permission.` 
                    });
                }
            }

            next(); // Everything looks perfect! Let the request proceed to controller.
        } catch (error) {
            console.error("🔒 JWT Security Interceptor Check failed:", error.message);
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: "Session expired. Please log in again." });
            }
            
            return res.status(400).json({ error: "Invalid token validation handshake." });
        }
    };
};

module.exports = { verifyRole };