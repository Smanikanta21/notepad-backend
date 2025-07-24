const connectDB = require('../database/dbConfig')
const express = require('express')
const auth = require('../auth/auth')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.json())
app.use(cors({
    origin : 'https://localhost;5173',
    credentials : true
}))
app.use('/auth' , auth)
app.listen(7777 , () => {
    console.log(`Server runnning on port 7777`)
})

connectDB()
.then(() => {
    console.log(`connected to database successfully`)
}).catch((err) => {
    console.log(err.message)
})