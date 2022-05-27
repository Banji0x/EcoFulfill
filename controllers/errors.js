// Error handling 
const errorhandler = (err) => { 
let errors = {email:'',password:'',option:''};

//code for incorrect details while logging in
if(err.message === 'Email not found!!!'){
    errors.email = 'Email not registered.'   
}
if(err.message === 'incorrect password'){
   errors.password = 'Password is Incorrect.Please enter the correct password.'   
}


//code for duplicates 
if(err.code === 11000){
errors.email = "Email already exists, please enter a new email address."
return errors;
}

//validation errors 
if(err.message.includes('user validation failed')){
//err.errors is a property that holds the email,password and options key which holds thier respective errors 
//Object.values returns an array 
Object.values(err.errors).forEach(({properties})=>{
 errors[properties.path] = properties.message; 
});
}
return errors;
};