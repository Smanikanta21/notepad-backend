const connectDB = require('../database/dbConfig')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const auth = require('../auth/auth')
const app = express()
const setupGooglePassport = require('../googleoauth/passport.js')

const Note = require('../models/notes.js')

const notes = express.Router();
const userAuthCheck = require('../middleware/userAuthCheck')

const passport = require('passport')
const cors = require('cors')
require('dotenv').config()

app.use(cookieParser())

app.use(express.json())
app.use(cors({
    origin : ['http://localhost:5173', 'https://note-pad-red.vercel.app'],
    credentials: true,
}))
app.use('/notes', notes)
app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    }
}));

notes.post('/create',userAuthCheck,async (req, res) => {
    const {title} = req.body;
    if(!title){
        return res.status(400).json({message: 'Title is required'});
    }
    try{
        const note = new Note({ title : title, user: req.user._id });
        await note.save();
        console.log('Note created:', note);
        return res.status(201).json({message: 'Note created successfully', note : note});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: error.message});
    }
})

notes.get('/fetchnotes', userAuthCheck, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


app.use(passport.initialize())
app.use(passport.session())
app.use('/auth' , auth)
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectDB()
.then(() => {
    console.log(`connected to database successfully`)
}).catch((err) => {
    console.log(err.message)
})


setupGooglePassport({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
});