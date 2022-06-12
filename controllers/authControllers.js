const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('./ErrorHandler');     

 //Jwt cookies expiry date in seconds 
const expiryDate  = 3 * 24 * 60 * 60 ;
//Jwt token for Buyer
const jwtTokenBuyer = (_id)=>{
//Maxage in seconds
return jwt.sign({_id},"Hybr1dBuyer",{
expiresIn: expiryDate
});   
};
//Jwt token for Buyer
const jwtTokenSeller = (_id)=>{
return jwt.sign({_id},"Hybr1dSeller",{
 expiresIn: expiryDate
 });   
 };
      

module.exports.registerGET=(req,res)=>{
}; 
module.exports.loginGET=(req,res)=>{
};

module.exports.registerPOST= async (req,res)=>{
   const {name,email, password,role} = req.body;
   try {
     const user = await User.create({name,email,password,role});
       delete req.cookies.jwtBuyer;
       delete req.cookies.jwtSeller;
       if(user.role === "Buyer"){
         const token = jwtTokenBuyer(user._id);
         res.cookie("jwtBuyer",token,{httponly:true,maxAge: 3 * 24 * 60 * 60 *1000 });
         res.status(200).json(` ${user.role} registered successfully`);
         }else{
          const token = jwtTokenSeller(user._id)        
          res.cookie("jwtSeller",token,{httponly:true,maxAge: 3 * 24 * 60 * 60 *1000 });
          res.status(200).json(` ${user.role} registered successfully`)};
    }catch (err) {
                  const errors = ErrorHandler(err);
                  res.status(400).send(errors); 
                  console.log(err);
       }
 };

module.exports.loginPOST= async (req,res)=>{
  req.cookies={};
  const {email,password} = req.body;
        try {
          const user = await User.login(email,password);
          if(user.role === "Buyer"){
                 const token = jwtTokenBuyer(user._id);
                 res.cookie("jwtBuyer",token,{httponly:true,maxAge: 3 * 24 * 60 * 60 *1000 });
                 res.status(201).json(user);
                 }else{
                   const token = jwtTokenSeller(user._id);
                   res.cookie("jwtSeller",token,{httponly:true,maxAge:  3 * 24 * 60 * 60 *1000 });
                   res.status(201).json(user);
                      }
        } catch (err) {
                 console.log(err);
                 const errors = ErrorHandler(err);
                 res.status(400).json(errors)
        }

 };


module.exports.logoutGET = async(req,res)=>{


};
