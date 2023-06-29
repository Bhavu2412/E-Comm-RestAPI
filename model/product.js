const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    quantity:{
        type:Number
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        // require : true
    }
})



// Add quantity update the quantity with order,cart etc

module.exports = mongoose.model('Prod', productSchema);