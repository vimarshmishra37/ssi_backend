var express = require('express');
var router = express.Router();
const user = require('../models/users');

const bcrypt = require('bcrypt');
const {getToken}=require('../utils/helper')
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/*
router.get('/song', async (req, res, next) => {
  const newSong = await song.create({ name: "hrbfd" }).;
 
});

router.get('/playlist', async (req, res, next) => {
  const newPlaylist = await playlist.create({ name: "hkjrenw" });

});
*/
router.get('/', function(req, res, next) {
    console.log("jh")
    res.send('respond with a ueurce');
  });
  
router.post('/login' ,async (req,res)=>{
  console.log("hjvjer");
  const {email,password} = req.body;
  console.log(req.body);
  const User=await user.findOne({email:email});
  
  if(!User)
  {
    return res.status(403).json({Error:"User does not exist"});
  }
  const isPasswordCorrect=await bcrypt.compare(password,User.password);
  if(!isPasswordCorrect)
  {
    return res.status(403).json({Error:"Password is incorrect"});
  }
  const token=await getToken(email,User);
  const userToken={...User.toJSON(),token};
  delete userToReturn.password;
  return res.status(200).json(userToken);
})
router.post("/register", async (req, res) => {
  // Ensure to provide a unique username
  console.log(req.body);
  const {email,password,firstname,lastname,username} = req.body;
  const User = await user.findOne({email:email});
  if(User)
  {
    return res.status(403).json({Error:"User already exists"});
  }

  const hashedpassword=await bcrypt.hash(password,10);
 const newuserdata={email,password:hashedpassword,firstname,lastname,username};
 const newuser=await user.create(newuserdata);
const token=await getToken(email,newuser);
  const userToken={...newuser.toJSON(),token};
  delete userToken.password;
  return res.status(200).json(userToken);
});

module.exports = router;

