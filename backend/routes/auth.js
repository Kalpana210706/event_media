// const express = require('express');
// const bcrypt = require('bcryptjs');
// const { PrismaClient } = require('@prisma/client');

// const router = express.Router();
// const prisma = new PrismaClient();

// // 🚀 USER SIGNUP ROUTE
// router.post('/signup', async (req, res) => {
//     try {
//         const { email, password, name, role } = req.body;

//         // 1. Check if the user already exists
//         const existingUser = await prisma.user.findUnique({
//             where: { email }
//         });
//         if (existingUser) {
//             return res.status(400).json({ error: "Email already registered!" });
//         }

//         // 2. Hash (encrypt) the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // 3. Save the user to our Neon Database
//         const newUser = await prisma.user.create({
//             data: {
//                 email,
//                 name,
//                 password: hashedPassword,
//                 role: role || "VIEWER" // Defaults to VIEWER if no role is sent
//             }
//         });

//         // 4. Send back a success message (excluding the password for security)
//         res.status(201).json({
//             message: "User registered successfully! 🎉",
//             user: {
//                 id: newUser.id,
//                 name: newUser.name,
//                 email: newUser.email,
//                 role: newUser.role
//             }
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// const jwt = require('jsonwebtoken'); // <-- Make sure to paste this line at the absolute top of routes/auth.js along with other imports

// // 2. LOGIN ROUTE (Authenticate a user)
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Validation: Did they enter both email and password?
//         if (!email || !password) {
//             return res.status(400).json({ error: "Please enter both email and password" });
//         }

//         // Find user by email in the database
//         const user = await prisma.user.findUnique({
//             where: { email }
//         });

//         // If user doesn't exist, stop them right there
//         if (!user) {
//             return res.status(400).json({ error: "Invalid email or password" });
//         }

//         // Compare the typed password with the encrypted hashed password in our database
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: "Invalid email or password" });
//         }

//         // Generate a secure JWT Wristband containing the User's ID and Role
//         const token = jwt.sign(
//             { id: user.id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' } // This token expires automatically in 1 day
//         );

//         // Send back a success message along with our secure token
//         res.json({
//             message: "Login successful! Welcome back 👋",
//             token,
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// module.exports = router;


const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// 🚀 1. USER REGISTER/SIGNUP ROUTE (Changed from /signup to /register)
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // Validation check
        if (!email || !password || !name) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered!" });
        }

        // Hash (encrypt) the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to our Database (Matches frontend roles: MEMBER / PHOTOGRAPHER)
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role || "MEMBER" 
            }
        });

        // Send back a success message
        res.status(201).json({
            message: "User registered successfully! 🎉",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 🔑 2. LOGIN ROUTE (Authenticate a user)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation: Did they enter both email and password?
        if (!email || !password) {
            return res.status(400).json({ error: "Please enter both email and password" });
        }

        // Find user by email in the database
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // If user doesn't exist
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Compare the typed password with the encrypted hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate a secure JWT Wristband
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey', // fallback in case JWT_SECRET is not in .env
            { expiresIn: '1d' } 
        );

        // Send back a success message along with our secure token
        res.json({
            message: "Login successful! Welcome back 👋",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;