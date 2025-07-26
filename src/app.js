const connectDB = require('../database/dbConfig')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const auth = require('../auth/auth')
const app = express()
const setupGooglePassport = require('../googleoauth/passport.js')
const noteRoutes = require('../routes/notes.js')
require('../googleoauth/passport.js')
const passport = require('passport')
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(cors({
    origin : ['http://localhost:5173', "https://note-pad-red.vercel.app"],
    credentials : true
}))

app.use('./notes', noteRoutes)

app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }
}));

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