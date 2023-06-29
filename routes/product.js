const express = require('express');
const { body } = require('express-validator');

const productController = require('../controller/product');
const isAuth = require('../util/isAuth');

const router = express.Router();

router.get('/', isAuth, productController.getProducts);

router.post('/create', [
    body('name')
    .trim()
    .isLength({min : 4, max : 15}),

    body('price')
    .isNumeric(),

    body('description')
    .trim()
    .isLength({min : 5})

],isAuth, productController.createProduct);

router.patch('/update/:prodId',[
    body('name').trim().isLength({min : 4, max : 15}),
    body('price').isNumeric(),
    body('description').trim().isLength({min : 5})
], isAuth, productController.UpdateProd);
router.delete('/delete/:prodId', isAuth, productController.deleteProduct);

module.exports = router;


