const mongoose = require('mongoose')

const connectDB = () => {
   return mongoose.connect(`mongodb+srv://siraparapuabhinay21:eRSNIVGEHscmP6cK@cluster0.bsza9xu.mongodb.net/note-pad`)
}

module.exports = connectDB