const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/user_managment_system");
const nocache = require('nocache');

const express = require("express");
const app = express();

app.use(express.static('public'));

app.use(nocache());

// for user routes
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

// for admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);

app.listen(5000, () => {
    console.log('Server is Running On : http://localhost:5000');
});