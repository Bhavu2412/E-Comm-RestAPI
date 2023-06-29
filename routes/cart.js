const express = require('express');

const cartController = require('../controller/cart');
const productController = require('../controller/product');
const isAuth = require('../util/isAuth');

const router = express.Router();

router.get('/cart',isAuth,cartController.getCart);
router.put('/cart/add/:prodId',isAuth,cartController.addToCart);
router.put('/cart/remove/:prodId',isAuth,cartController.deleteFromCart);
router.delete('/cart/delete',isAuth,cartController.deleteCart);



module.exports = router;