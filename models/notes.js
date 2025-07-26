const mangoose = require('mongoose');

const noteSchema = new mangoose.Schema({
    title:{type: String, required: true},
    user:{type:mangoose.Schema.Types.ObjectId,ref: 'User',required: true},\
    createdAt:{type:Date, default: Date.now},

})

module.exports = mangoose.model('Note', noteSchema);
