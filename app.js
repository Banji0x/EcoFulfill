const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieparser = require('cookie-parser');

const app = express();


//middleware
app.use(express.json());
app.use(cookieparser());

//database connection 
// const dbUri = 'mongodb+srv://Eniola:1Lz89wi2IlOYyr24@cluster0.czsdt.mongodb.net/?retryWrites=true&w=majority';
// mongoose.connect(dbUri,{useNewUrlParser:true,useUnifiedTopology:true,/*useCreateIndex:true*/})
// .then(()=>{ 
//     console.log("connected to mongoDB");
//     app.listen(3000)}).catch(err=>{
// console.log(err);
// });

app.listen(3000);

//Routes 
app.get('/api/homepage',(req,res)=>{
res.send("Welcome to the homepage");
})
app.get('/api/buyer/list-of-sellers',(req,res)=>{

});
app.use(authRoutes);
