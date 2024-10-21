const express = require('express');
const router = express.Router();
const user = require('../models/users');
const bcrypt = require('bcrypt');
const { getToken } = require('../utils/helper');

/* Create user (for testing purpose only) */
router.get('/', async function (req, res, next) {
    const newUser = {
        name: "Vimarsh",
        email: "vimarshmishra@gmail.com",
        password: await bcrypt.hash("yourPasswordHere", 10), // Hash the password
        age: 25,
        gender: "Male",
        dob: new Date('1998-01-01'),
        address: "123 Street, City",
        phone: 1234567890,
        role: "User"
    };

    try {
        if (await user.findOne({ email: newUser.email })) {
            return res.send('User already exists');
        }
        const createdUser = await user.create(newUser);
        console.log(createdUser);
        return res.send('User created successfully');
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send('Error creating user');
    }
});

/* User login */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const User = await user.findOne({ email: email });

    if (!User) {
        return res.status(403).json({ Error: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, User.password);
    if (!isPasswordCorrect) {
        return res.status(403).json({ Error: "Password is incorrect" });
    }

    const token = await getToken(email, User);
    const userToken = { ...User.toJSON(), token };
    delete userToken.password; // Corrected typo here
    return res.status(200).json(userToken);
});

module.exports = router;
