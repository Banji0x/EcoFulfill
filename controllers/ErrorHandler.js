// Error handler 
const ErrorHandler = (err) => { 
    let errors = {name: '',email:'',password:'',role:''};
    
    // Code for incorrect details while logging in
    if(err.message === 'Email not found!!!'){
           errors.email = 'Email not registered.'   
    }
    if(err.message === 'Incorrect password!!!'){
           errors.password = 'Password is incorrect.Please enter the correct password.'   
    }
     
      
    // Code for duplicates while registering 
    if(err.code === 11000){
           errors.email = "Email already exists, please enter a new email address."
    return errors;
    }
      
    // Validation errors while logging in
    if(err.message.includes('user validation failed')){
    //err.errors is a property that holds the email,password and role key which holds their respective errors 
    // Object.values returns an array 
           Object.values(err.errors).forEach(({properties})=>{
           errors[properties.path] = properties.message; 
    });
    }
    return errors;
    };      
    
    module.exports = ErrorHandler