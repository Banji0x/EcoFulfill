require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const app = express();
const authRoute = require('./routes/authRoute');
const buyerRoute = require('./routes/buyerRoute');
const sellerRoute = require('./routes/sellerRoute');

//middleware
app.use(express.json());
app.use(cookieparser());

// database connection
const PORT = process.env.PORT || 3000;
const DBURI = process.env.DBURI

mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
      app.listen(PORT, () => { console.log(` Connected to MongoDb and server is running on PORT: ${PORT}`) })
});

//Routes
app.get('/api/homepage', (req, res) => {
      res.send("Welcome to the homepage")
});
//get current user
app.get('/currentUser', (req, res) => {
      res.json(req.cookies);
});
//authRoutes
app.use(authRoute);
//buyer route
app.use(buyerRoute);
//seller route
app.use(sellerRoute);




