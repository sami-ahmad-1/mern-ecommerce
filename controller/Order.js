const { Order } = require('../model/Order');


exports.fetchOrderByUser = async (req, res) => {   
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id })
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  try {    
    const allOrders = await Order.find();    
    res.status(200).json(allOrders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
};

exports.createOrder = async (req,res) => {  
  const order = new Order(req.body)
  try{
    const doc = await order.save()
    res.status(201).json(doc)
  }catch(err){
    res.status(400).json(err)
  }
}


exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Order.findByIdAndDelete(id)
    res.status(200).json(doc)
  } catch (err) {
    res.status(400).json(err)
  }
};


exports.UpdateOrder = async (req, res) => {
  const { id } = req.params;  
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, {new:true});
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};




