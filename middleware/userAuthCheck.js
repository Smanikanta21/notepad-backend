require('dotenv').config();
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const userAuthCheck = async(req,res,next) =>{
    console.log("req.cookies" , req.cookies)
    if(!token){
        return res.status(401).json({message: 'Unauthorized access'});
    }
    try{
        const userdata = jwt.verify(token,process.env.JWT_SECRET);
        const ouruser = await User.findById(userdata._id);
        if(!ouruser){
            return res.status(401).json({message: 'Unauthorized access'});
        }
        req.user = ouruser;
        next();
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

module.exports = userAuthCheck;