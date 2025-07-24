const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function () { return this.provider === 'local' } },
  provider: { type: String, default: 'local' },
  profilepic: {
    type: String,
    default: 'https://res.cloudinary.com/dz1q5xj2h/image/upload/v1709301234/default-profile-pic.png'
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
