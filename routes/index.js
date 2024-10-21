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
console.log(User);
    if (!User) {
        return res.status(403).json({ Error: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, User.password);
    if (password !== User.password) {
        return res.status(403).json({ Error: "Password is incorrect" });
    }

    const token = await getToken(email, User);
    const userToken = { ...User.toJSON(), token };
    delete userToken.password; // Corrected typo here
    return res.status(200).json(userToken);
});
router.post('/register', async (req, res) => {
  console.log(`req.body`, req.body);
  const{email,password,name,age,gender,dob,address,phone,role}=req.body;
  const xuser = await user.findOne({ email: email });
  console.log("wjyefbw",xuser);
  if (xuser) {
    return res.status(403).json({ Error: "User already exists" });
  }
  const newUser = {
    email,
    password: await bcrypt.hash(password, 10),
    name,
    age,
    gender,
    dob,
    address,
    phone,
    role
  };
  const hashPassword = await bcrypt.hash(newUser.password, 10);
  const createdUser = await user.create(newUser);
  const token = await getToken(email, createdUser);
  console.log(createdUser);
  const userToReturn = { ...createdUser.toJSON(), token };
delete userToReturn.password;
return res.status(200).json(userToReturn);
  //return res.send('User created successfully');
});
module.exports = router;
