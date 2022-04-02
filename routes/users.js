const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user')

// Get all the users
router.get('/', async (req, res) => {
    const users = await User
        .find()
        .select({ _id: 1, name: 1, age: 1 });
    res.send(users);
});

// Create a new user
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error : error.details[0].message });

    let user = new User({
        name: req.body.name,
        age: req.body.age
    });

    try {
        user = await user.save();
    }
    catch (e) {
        console.log(e)
    }

    res.status(200).json(user);
});

// Update a user
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User
        .findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                age: req.body.age
            },
            { new: true });
    if (!user) return res.status(404).json({ error: 'No match for the ID.' });

    res.status(200).json(user);
});

// Delete a user
router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).json({ error: 'No match for the ID.' });

    res.status(200).json(user);
});

// Get a user
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({error: 'No match for the ID.' });

    res.status(200).json(user);
});

module.exports = router;
