const jwt = require('jsonwebtoken');

const BuyerOnly = async(req,res,next)=>{
const encodedToken = req.cookies.jwtBuyer;
if(encodedToken){
jwt.verify(encodedToken,"Hybr1dBuyer",(err,decodedToken)=>{
if(err){
   console.log(err)
   res.redirect('/api/auth/login')
}else{
   req.user_id = decodedToken._id;
   next();
}
});
}else{
res.redirect('/api/auth/register')
}
}

const SellerOnly = async(req,res,next)=>{
    const encodedToken = req.cookies.jwtSeller;
    if(encodedToken){
    await jwt.verify(encodedToken,"Hybr1dSeller",(err,decodedToken)=>{
    if(err){
      console.log(err)
      res.redirect('/api/auth/login')
    }else{
       req.user_id = decodedToken._id;
       next();
    }
    });
    }else{
     res.redirect('/api/auth/login')
    }
    
    }

module.exports = {SellerOnly,BuyerOnly};