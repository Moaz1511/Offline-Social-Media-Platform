// backend/routes/posts.js
const express = require('express');
const Post = require('../models/Post');
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

// Create Post
router.post('/', verifyToken, async (req, res) => {
    const newPost = new Post({ userId: req.user.id, content: req.body.content });
    await newPost.save();
    res.status(201).send('Post created');
});

// Get Posts
router.get('/', verifyToken, async (req, res) => {
    const posts = await Post.find().populate('userId', 'username');
    res.json(posts);
});

module.exports = router;
