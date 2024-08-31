const express = require('express');
const { creteProduct, fetchAllProducts ,fetchProductDetailAPI , updateProduct , deleteFromProductList} = require('../controller/Products')
const router = express.Router()

router.post('/', creteProduct)
    .get('/', fetchAllProducts)
    .get('/:id' ,fetchProductDetailAPI)
    .patch('/:id' ,updateProduct)
    .delete('/:id', deleteFromProductList);
    
exports.router = router