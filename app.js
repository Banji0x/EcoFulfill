const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const buyerRouters = require('./routes/buyerRouters');
const sellerRouters = require('./routes/sellerRouters');
const cookieparser = require('cookie-parser');

const app = express();


//middleware
app.use(express.json());
app.use(cookieparser());

//database connection 
const dbUri = "mongodb://localhost/RestApiDB";
const PORT = 3005;
mongoose.connect(dbUri).then(()=>{ 
    console.log("connected to mongoDB");
    app.listen(PORT,()=>{
    console.log("Server is running");
    })})
    .catch(err=>{
console.log(err);
});


//Routes 
app.get('/api/homepage',(req,res)=>{
res.send("Homepage");
});

//get current user
app.get('/currentUser',(req,res)=>{
res.json(req.cookies);
});

//authRoutes
app.use(authRoutes);

//buyer route
app.use(buyerRouters);

//seller route
app.use(sellerRouters);
