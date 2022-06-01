const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
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

app.listen(3000);

//Routes 
app.get('/api/homepage',(req,res)=>{
res.send("Homepage");
});

//authRoutes
app.use(authRoutes);

//buyer route
app.use(buyerRoutes);

//seller route
app.use(sellerRoutes);
