const connectDB = require('../database/dbConfig')
const express = require('express')
const auth = require('../auth/auth')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.json())
app.use(cors({
    origin : ['http://localhost:5173', "https://note-abqtry4cv-smanikanta21s-projects.vercel.app"],
    credentials : true
}))
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

