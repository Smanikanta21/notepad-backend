const express = require('express')
const cookieParser = require('cookie-parser')
require('../googleoauth/passport.js')
const passport = require('passport');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = express.Router()
const { User } = require('../models/User')
require('dotenv').config()
auth.use(cookieParser())

auth.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

auth.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: 'https://note-pad-red.vercel.app/home',
    failureRedirect: 'https://note-pad-red.vercel.app/login',
    session: false
  })
);

auth.post('/login' , async (req , res) => {
   const { email , password } = req.body
   if (!email || !password) {
      return res.status(400).send(`email or password is missing`)
   }
   try{
      const ourUserArr = await User.find({ email })
      if (ourUserArr.length === 0) return res.status(401).send(`Such user does not exist`)
      const isPassword = await bcrypt.compare(password , ourUserArr[0].password)
      if (isPassword) {
         const token = jwt.sign({ password } , process.env.JWT_SECRET , {expiresIn : '1day'})
         res.cookie(`token` , token , {
            httpOnly : true,
            secure : true,
            sameSite : 'none',
         })
         console.log(res.cookie)
         return res.status(200).json({
            'userData' : ourUserArr[0]
         })
      }return res.status(401).send(`Password is Incorrect`)
   }catch(err){
      console.log(err.message)
      return res.status(500).send(`Internal Server Error`)
   }
})
auth.post('/signup' , async (req , res) => {
   const { name , email , password } = req.body
   if (!email || !password || !name) return res.status(400).send(`Bad Request`)
   try{
      const hashedPassword = await bcrypt.hash(password , 10)
      const newUser = new User({name , email , password : hashedPassword})
      await newUser.save()
      return res.status(201).send(`User Creatated Successfully`)
   }catch(err){
      console.log(err.message)
      return res.status(500).send(`Internal Server Error`)
   }
})
auth.post('/logout' , async (req , res) => {
   return res.status(200).cookie(`token` , null , {
      expires : new Date(Date.now()),
      httpOnly : true,
      secure : true,
   }).send(`User Logout Successfully`)
})

module.exports = auth