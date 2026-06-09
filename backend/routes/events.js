const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyRole } = require('./middleware'); // Ensures clean relative tracking

const router = express.Router();
const prisma = new PrismaClient();

//  1. GET ALL CAMPUS EVENTS
router.get('/', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  2. CREATE NEW CAMPUS EVENT ENTRY NODE
router.post('/', verifyRole(['ADMIN', 'PHOTOGRAPHER']), async (req, res) => {
    try {
        const { name, description, category } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Event name is mandatory!" });
        }

        // Clean values format mapping to match strict Database Enums
        // Example: "Sports Meet" -> "SPORTS_MEET"
        let mappedCategory = String(category).toUpperCase().replace(/\s+/g, '_');

        //  FIX: Required 'date' argument setup. Current date standard backup logic inject kiya hai.
        const eventDate = new Date(); 

        // Database insertion matching exact constraints
        const newEvent = await prisma.event.create({
            data: {
                name: name.trim(),
                description: description ? description.trim() : '',
                category: mappedCategory,
                date: eventDate // Injected current time ISO node to satisfy prisma schema
            }
        });

        console.log("🚀 Success! New Event Saved:", newEvent.name);
        return res.status(201).json({ message: "Event created successfully! 🎉", event: newEvent });

    } catch (error) {
        console.error("❌ Database Write Failure Trace:", error.message);
        return res.status(500).json({ 
            error: "Prisma rejected insertion payload structural layout.",
            systemTrace: error.message 
        });
    }
});

//  SAFE BINDING CORRECTION FIX: Makes sure Express doesn't crash on app.use handler parsing
module.exports = router;