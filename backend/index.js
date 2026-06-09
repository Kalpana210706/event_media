// const express = require('express');
// const app = express();
// const cors = require('cors');
// const { PrismaClient } = require('@prisma/client');
// const authRoutes = require('./routes/auth');
// const eventRoutes = require('./routes/events');
// const mediaRoutes = require('./routes/media'); // <-- 1. Import media routes
// require('dotenv').config();

// const app = express();
// const prisma = new PrismaClient();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/media', mediaRoutes); // <-- 2. Register media endpoints

// app.get('/', (req, res) => {
//     res.send('🚀 Event & Media Management API is running smoothly!');
// });

// app.listen(PORT, () => {
//     console.log(`Server is happily running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const mediaRoutes = require('./routes/media'); 
require('dotenv').config();

const app = express(); // Keval ek baar declare kiya hai!
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
// ... baaki imports ke sath upar dalein
const favoriteRoutes = require('./routes/favorites');
const notificationRoutes = require('./routes/notifications');

// ... middlewares ke niche endpoints dalein
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);

// Cors aur JSON Parser Binding
app.use(cors());
app.use(express.json());

// 🌟 CRITICAL STATIC IMAGE ROUTE: Yeh frontend ko upload ki gayi images access karne deta hai
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes Router Engine Mount
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/media', mediaRoutes); 

app.get('/', (req, res) => {
    res.send('🚀 Event & Media Management API is running smoothly!');
});

app.listen(PORT, () => {
    console.log(`Server is happily running on http://localhost:${PORT}`);
});