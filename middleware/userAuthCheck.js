require('dotenv').config();
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const userAuthCheck = async(req,res,next) =>{
    const token = req.cookies && req.cookies.token;

    try{
        if(!token){
            return res.status(401).json({message: 'Unauthorized access'});
        }
        const userdata = jwt.verify(token,process.env.JWT_SECRET);
        const ouruser = await User.findById(userdata.id);
        if(!ouruser){
            return res.status(401).json({message: 'Unauthorized access'});
        }
        req.user = ouruser;
        next();
    }catch(error){
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = userAuthCheck;