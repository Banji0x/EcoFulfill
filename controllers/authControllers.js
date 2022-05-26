const User = require('../models/User');
const jwt = require('jsonwebtoken');


//Error handling 
const errorhandler = (err) => { 
let errors = {email:'',password:''};

//code for duplicates 
if(err.code === 11000){
errors.email = "Email already exists, please enter a new email address."
return errors;
}

//validation errors 
if(err.message.includes('user validation failed')){
//err.errors is a property that holds the email and password key which holds thier respective errors 
//Object.values returns an array 
Object.values(err.errors).forEach((item)=>{
 errors[item.properties.path] = item.properties.message; 
});
}
return errors;
};


//Jwt token 
const jwtToken = (id)=>{
 
//Jwt cookie expiry date 
const maxAge = 3 * 24 * 60 * 60 ;
//Maxage in seconds
return jwt.sign(id,"Hybr1dTechnologies",{ expiresIn: maxAge });   
};
 


module.exports.register_get=(req,res)=>{

}; 

module.exports.login_get=(req,res)=>{

};

module.exports.register_post= async (req,res)=>{
   const {email, password} = req.body;
   try {

   const user = await User.create({email:email, password:password});
   const token =  jwtToken(user._id);
   res.cookie('jwt', token,{httponly:true,maxAge:maxAge * 1000});
   res.status(201).json({user:user._id});
   
   } catch (err) {
      const errors = errorhandler(err);
      const {email} = errors;
      const {password} = errors;


      if((email.length !==0 && password.length !==0)){
            res.status(401).json({email, password});
      }
     else if((email.length !== 0)){ 
            res.status(400).json({email})}
      
      else if((password.length !==0)){
            res.status(400).json({password});
      }
}  
};

module.exports.login_post=(req,res)=>{

const { email,password } = req.body;

try {
        
    res.status(200).json();
} catch (err) {
      
    res.status(400).json();
}



};