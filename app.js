const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');

const app = express();

app.use(bodyParser.json());

app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);

app.use((err,req,res,next)=>{
    const  status = err.statusCode;
    const data =err.data;
    const message =err.message;
    res.status(status).json({message : message , data : data});
})

mongoose.connect('mongodb+srv://Bhavya2:1234567890@cluster0.8l12zpa.mongodb.net/my?retryWrites=true&w=majority')
.then(result=>{
    console.log('Connected to database!!!');
})

app.listen(6000, result => {
    console.log('Connected to server!!!');
})

