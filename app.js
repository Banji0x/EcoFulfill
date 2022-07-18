require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const { currentUser } = require('./middleware/authMiddleware')
const authRoute = require('./routes/authRoute');
const buyerRoute = require('./routes/buyerRoute');
const sellerRoute = require('./routes/sellerRoute');
const app = express();

//middleware
app.use(express.json());
app.use(cookieparser());

//database connection
const PORT = process.env.PORT || 3000;
const DBURI = process.env.DBURI
mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true }, () => {
      app.listen(PORT, () => { console.log(` Connected to MongoDb...server is running on PORT: ${PORT}`) })
});

//Routes
//all GET requests
app.get('*', currentUser);
//homepage
app.get('/api/homepage', (req, res) => {
      //  res.render('homepage') 
});

//auth routes
app.use(authRoute);
//buyer route
app.use(buyerRoute);
//seller route
app.use(sellerRoute);
