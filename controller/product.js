const Prod = require('../model/product');
const User = require('../model/user');

exports.getProducts = (req, res, next) => {
    Prod.find()
        .then(products => {
            if (!req.userId) {
                const err = new Error('User not present. Please Login!!!');
                err.statusCode = 404;
                throw err;
            }
            if (!products) {
                const err = new Error('Product are not present!!!');
                err.statusCode = 404;
                throw err;
            }
            console.log(products);
            res.status(200).json({ message: 'Products Found!!!', products: products });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.createProduct = (req, resp, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const imageUrl = req.body.imageUrl;
    
    Prod.findOne({ description: description, name: name })
        .then(product => {
            if (product) {
                
                const err = new Error('Product already exists!!!');
                err.statusCode = 400;
                throw err;
            }
            if (!req.userId) {
                const err = new Error('Please Login First !!!');
                err.statusCode = 400;
                throw err;
            }
            
            return User.findById( req.userId );
        })
        .then(user => {
            if (user.role !== 'seller') {
                const err = new Error('User is customer and not seller. Make another account to sell products with role seller!!!');
                err.statusCode = 400;
                throw err;
            }
            const products = new Prod({
                name: name,
                description: description,
                price: price,
                imgeUrl: imageUrl,
                quantity: quantity,
                user: req.userId
            });
            return products.save();
        })
        .then(result => {
            resp.status(200).json({ message: 'product created successfully !!!', product: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.UpdateProd = (req, res, next) => {
    const { prodId } = req.params;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const quantity = req.body.quantity;

    Prod.findById(prodId)
        .then(product => {
            if (!product) {
                const err = new Error('Product donot exists!!!');
                err.statusCode = 400;
                throw err;
            }
            if (product.user.toString() !== req.userId) {
                const err = new Error('Product is not created by user (Update)!!!');
                err.statusCode = 400;
                throw err;
            }
            product.name = name;
            product.description = description;
            product.price = price;
            product.imageUrl = imageUrl;
            product.quantity = quantity;
            return product.save();
        }).then(result => {
            res.status(200).json({ message: 'product Updated successfully !!!', product: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteProduct = (req, res, next) => {
    const { prodId } = req.params;
    Prod.findById(prodId)
        .then(product => {
            if (!product) {
                const err = new Error('Product is not present!!!');
                err.statusCode = 400;
                throw err;
            }
            if (product.user.toString() !== req.userId) {
                const err = new Error('Product is not created by user (Delete)!!!');
                err.statusCode = 400;
                throw err;
            }
            return Prod.findByIdAndRemove(prodId);
        })
        .then(result => {
            res.status(200).json({ message: 'Product deleted successfully!!!', prodId: result._Id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}