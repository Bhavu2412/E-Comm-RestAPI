const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['seller', 'customer', 'admin']
    },
    cart: [{
        products: {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        },
        quantity: {
            type: Number
        }
    }],
    otp: {
        type: Number
    },
    otpExpire: {
        type: Number
    }
})

module.exports = mongoose.model('User', userSchema);