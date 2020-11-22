const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')

module.exports.OwnerLogin = async (req, res, next) => {
   const {username, password} = req.body;
   const ownerUsername = process.env.OWNER_USERNAME 
   const ownerPassword = process.env.OWNER_PASSWORD
   console.log(req.body)
   try {
      if(username === ownerUsername && password === ownerPassword) {
         const token = jwt.sign({
            username: ownerUsername,
            password: ownerPassword
         },
         process.env.JWT_SECRET,
         {
            expiresIn: process.env.JWT_EXPIRE,
         })
         res.cookie('authorization', token, { httpOnly: true, maxAge :  24 * 60 * 60});
         res.status(200).end()
      } else {
         const err = new Error('Invalid Owner Credetials')
         err.statusCode = 403
         throw err
      }
   } catch (error) {
      next(error)
   }
}

exports.AdminLogin = async (req, res, next) => {
   try {
         const {username, password} = req.body
         let admin = await Admin.findByCredentials(username, password)
         const JWTtoken = await admin.generateAuthToken()
         admin = admin.toJSON()
         res.cookie('authorization', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
        res.status(200).json(admin)
   } catch (error) {
      next(error)
   }
}

exports.CreateAdmin=async (req,res,next)=>{
   try{
      const  {username,password,role}=req.body;
      let admin = await Admin.create({
          username,
          password,
          role
      });
      const JWTtoken =await admin.generateAuthToken();
      admin =admin.toJSON();
      res.cookie("authorization",JWTtoken,{
       maxAge: 24 * 60 * 60 * 1000,
       httpOnly: false,  
      });
      res.status(201).json(admin);
   }
   catch(e){
       next(e);
   }
}
