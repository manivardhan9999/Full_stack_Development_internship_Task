const express = require('express');
const jwt = require('jsonwebtoken');
const Note = require('../models/Note');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

router.use(authMiddleware);

router.post('/', async (req, res) => {
    const { title, content } = req.body;
    const note = new Note({
        userId: req.user.userId,
        title,
        content
    });

    await note.save();
    res.status(201).send(note);
});

router.get('/', async (req, res) => {
    const notes = await Note.find({ userId: req.user.userId });
    res.json(notes);
});

router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        { title, content, updatedAt: new Date() },
        { new: true }
    );

    if (!note) return res.status(404).send('Note not found');
    res.send(note);
});

router.delete('/:id', async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!note) return res.status(404).send('Note not found');
    res.send('Note deleted');
});

module.exports = router;
