// // const jwt = require('jsonwebtoken');

// // // Middleware to verify if the user is logged in and check their role
// // const verifyRole = (allowedRoles) => {
// //     return (req, res, next) => {
// //         // 1. Get the token from the request header
// //         const authHeader = req.headers['authorization'];
        
// //         // S3 standard token comes as: "Bearer <token>"
// //         const token = authHeader && authHeader.split(' ')[1];

// //         if (!token) {
// //             return res.status(401).json({ error: "Access denied. No token provided." });
// //         }

// //         try {
// //             // 2. Decode and verify the token using our secret key
// //             const verified = jwt.verify(token, process.env.JWT_SECRET);
// //             req.user = verified; // Stores { id: "...", role: "..." } in req.user

// //             // 3. Check if the user's role is allowed to access this action
// //             if (!allowedRoles.includes(req.user.role)) {
// //                 return res.status(403).json({ error: "Access forbidden. You do not have permission for this." });
// //             }

// //             next(); // Everything looks good! Let the user through to the route.
// //         } catch (error) {
// //             res.status(400).json({ error: "Invalid token setup." });
// //         }
// //     };
// // };

// // module.exports = { verifyRole };

// const jwt = require('jsonwebtoken');

// // Middleware to verify if the user is logged in and check their role
// const verifyRole = (allowedRoles) => {
//     return (req, res, next) => {
//         // 1. Get the token from the request header
//         const authHeader = req.headers['authorization'];
        
//         // Safety check: Agar header hi missing ho
//         if (!authHeader) {
//             return res.status(401).json({ error: "Access denied. No authorization header provided." });
//         }

//         // Standard token splits as: "Bearer <token>"
//         // .trim() lagaya taaki extra whitespaces block na karein request ko
//         const token = authHeader.split(' ')[1]?.trim();

//         if (!token || token === 'null' || token === 'undefined') {
//             return res.status(401).json({ error: "Access denied. Token missing or malformed." });
//         }

//         try {
//             // 2. Decode and verify the token using our secret key
//             // process.env.JWT_SECRET fallback lagaya hai temporary testing ke liye agar env issue ho
//             const secretKey = process.env.JWT_SECRET || 'your_fallback_secret_key_here';
            
//             const verified = jwt.verify(token, secretKey);
//             req.user = verified; // Stores decoded payload (e.g., { id: "...", role: "..." })

//             // 3. Check if the user's role is allowed to access this action
//             if (allowedRoles && allowedRoles.length > 0) {
//                 if (!allowedRoles.includes(req.user.role)) {
//                     return res.status(403).json({ 
//                         error: `Access forbidden. Role '${req.user.role}' is not authorized for this scope.` 
//                     });
//                 }
//             }

//             next(); // Pass control to the next handler block!
//         } catch (error) {
//             console.error("JWT Verification Security Alert:", error.message);
            
//             // Agar token such mein expire ho gaya ho
//             if (error.name === 'TokenExpiredError') {
//                 return res.status(401).json({ error: "Session expired. Please login again." });
//             }
            
//             return res.status(400).json({ error: "Invalid token validation handshake failed." });
//         }
//     };
// };

// module.exports = { verifyRole };


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