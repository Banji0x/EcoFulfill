const User = require('../models/User');
const jwt = require('jsonwebtoken');


// Error handling 
const errorhandler = (err) => { 
let errors = {email:'',password:'',option:''};

// Code for incorrect details while logging in
if(err.message === 'Email not found!!!'){
       errors.email = 'Email not registered.'   
}
if(err.message === 'incorrect password'){
       errors.password = 'Password is Incorrect.Please enter the correct password.'   
}
  
  
// Code for duplicates 
if(err.code === 11000){
       errors.email = "Email already exists, please enter a new email address."
return errors;
}
  
// Validation errors 
if(err.message.includes('user validation failed')){
//err.errors is a property that holds the email,password and options key which holds thier respective errors 
// Object.values returns an array 
       Object.values(err.errors).forEach(({properties})=>{
       errors[properties.path] = properties.message; 
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
const {email, password,option} = req.body;
try {
const user = await User.create({email,password,option});
const token= jwtToken(user._id);
             res.cookie('jwt', token,{httponly:true,maxAge:maxAge * 1000});
             res.status(201).json({user:user._id});
}catch (err) {
const errors = errorhandler(err);
let {email,password,option} = errors;
if(option.includes("is not a valid enum value for path")){
             option = "Invalid Input";
}

if(email.length !==0 && password.length !==0 && option.length !==0 ){
             res.status(401).json({email, password,option});
}
else if((email.length !== 0)){ 
             res.status(400).json({email})
}
else if((password.length !==0)){
             res.status(400).json({password});
}
else if(option.length !==0){
             res.status(400).json({option});
}
}
}

module.exports.login_post= async (req,res)=>{

const { email,password } = req.body;

try {
       const user = await User.login(email,password);
       const token =  jwtToken(user._id);
       res.cookie('jwt', token,{httponly:true,maxAge:maxAge * 1000});
       res.status(200).json({user: user._id});

} catch (err) {
       const errors = errorhandler(err);
       const {email} = errors;
       const {password} = errors;

if((email.length !== 0)){ 
       res.status(400).json({email})}
      
       else if((password.length !==0)){
       res.status(400).json({password});
      }
}
}