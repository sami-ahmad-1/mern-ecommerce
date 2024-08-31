const express = require('express');
const { fetchCartByUser, addToCart, deleteFromCart, UpdateCart } = require('../controller/Cart');
const router = express.Router();

router.post('/', addToCart);
router.get('/own', fetchCartByUser);
router.delete('/:id', deleteFromCart);
router.patch('/:id', UpdateCart);

exports.router = router;
