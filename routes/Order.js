
const express = require('express');
const { createOrder, fetchOrderByUser, deleteOrder, UpdateOrder, fetchAllOrders } = require('../controller/Order');

const router = express.Router();

router.post('/', createOrder)
      .get('/allOrders', fetchAllOrders)
      .get('/own', fetchOrderByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', UpdateOrder)

exports.router = router;

