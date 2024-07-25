// backend/routes/likes.js
const express = require('express');
const Like = require('../models/Like');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied');
    try {
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

// Like a Post
router.post('/', verifyToken, async (req, res) => {
    const like = new Like({
        postId: req.body.postId,
        userId: req.user.id
    });
    await like.save();
    res.status(201).send('Post liked');
});

// Unlike a Post
router.delete('/', verifyToken, async (req, res) => {
    await Like.deleteOne({
        postId: req.body.postId,
        userId: req.user.id
    });
    res.status(200).send('Post unliked');
});

// Get Likes by Post ID
router.get('/:postId', verifyToken, async (req, res) => {
    const likes = await Like.find({ postId: req.params.postId }).populate('userId', 'username');
    res.json(likes);
});

module.exports = router;
