const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// 🔔 1. Get User's Notifications
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' } // Newest first
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  2. Mark Notification as Read
router.put('/read/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
        res.json({ message: "Notification marked as read ✔️" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;