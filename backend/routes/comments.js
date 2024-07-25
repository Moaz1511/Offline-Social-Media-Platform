// backend/routes/comments.js
const express = require('express');
const Comment = require('../models/Comment');
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

// Create Comment
router.post('/', verifyToken, async (req, res) => {
    const newComment = new Comment({
        postId: req.body.postId,
        userId: req.user.id,
        content: req.body.content
    });
    await newComment.save();
    res.status(201).send('Comment created');
});

// Get Comments by Post ID
router.get('/:postId', verifyToken, async (req, res) => {
    const comments = await Comment.find({ postId: req.params.postId }).populate('userId', 'username');
    res.json(comments);
});

module.exports = router;
