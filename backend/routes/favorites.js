const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// 1. Toggle Favorite (Add ya Remove karne ke liye ek hi route)
router.post('/toggle', async (req, res) => {
    try {
        const { userId, mediaId } = req.body;

        // Check karo kya pehle se fav hai
        const existingFav = await prisma.favorite.findUnique({
            where: { userId_mediaId: { userId, mediaId } }
        });

        if (existingFav) {
            // Agar pehle se hai toh remove (unfavorite) kar do
            await prisma.favorite.delete({
                where: { id: existingFav.id }
            });
            return res.json({ message: "Removed from favorites 💔", isFavorite: false });
        } else {
            // Agar nahi hai toh add kar do
            await prisma.favorite.create({
                data: { userId, mediaId }
            });
            return res.status(201).json({ message: "Added to favorites ❤️", isFavorite: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  2. Get User's All Favorites
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const favs = await prisma.favorite.findMany({
            where: { userId }
        });
        res.json(favs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;