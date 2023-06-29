

const User = require('../model/user');


exports.getCart = (req, res, next) => {
    let ncart = [];
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const err = new Error('User is not Logged in!!!');
                err.statusCode = 400;
                throw err;
            }
            if(user.role!=='customer'){
                const err = new Error('User is a seller .Please add another account with role customer!!!');
                err.statusCode = 400;
                throw err;
            }
            res.status(200).json({ message: 'Cart found', cart: user.cart });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.addToCart = (req, res, next) => {
    let prodfound;
    const prod = req.params.prodId;
    const quantity = req.body.quantity;
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const err = new Error('User is not Logged in!!!');
                err.statusCode = 400;
                throw err;
            }
                user.cart.forEach(product=>{
                    if(product.products.toString()=== prod){
                        prodfound = product;
                    }
                    
                })
            if(prodfound){
                prodfound.quantity += quantity;
            }
            else{
                user.cart.push({ products: prod, quantity: quantity });
            }

            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Product Added to cart!!!', user: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteFromCart = (req, res, next) => {
    const prod = req.params.prodId;
    const quantity = req.body.quantity;
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const err = new Error('User is not Logged in!!!');
                err.statusCode = 400;
                throw err;
            }
            const foundProduct = user.cart.find(item => item.products.toString() === prod);
            if (foundProduct.quantity < quantity) {
                const err = new Error('You have less quantity in the cart!!!');
                err.statusCode = 400;
                throw err;
            }
            user.cart.find(item => item.products.toString() === prod).quantity = foundProduct.quantity - quantity;
            if (foundProduct && foundProduct.quantity === 0) {
                user.cart = user.cart.filter(item => item.products.toString() !== prod);
            }
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'User Cart Updated!!!', result: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteCart = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const err = new Error('User is not Logged in!!!');
                err.statusCode = 400;
                throw err;
            }
            user.cart = [];
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'User Cart Updated!!!', result: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}





