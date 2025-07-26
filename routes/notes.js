const express = require('express')
const router = express.Router();
const Note = require('../models/notes');
const UserAuthCheck = require('../middleware/userAuthCheck')

router.post('/create',UserAuthCheck,async (req, res) => {
    const {tiitle} = req.body;
    if(!tiitle){
        return res.status(400).json({message: 'Title is required'});
    }

    try{
        const note = new Note({ tittle, user: req.user._id });
        await note.save();
        res.status(201).json({message: 'Note created successfully', note});
    }catch{
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
})

exports = router;