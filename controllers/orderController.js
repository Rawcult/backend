const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const orderModel = require("../models/order");
const productModel = require("../models/product");
const userModel = require("../models/user");
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

const getAllOrders = async (req, res) => {
  const orders = await orderModel.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await orderModel.findOne({ _id: orderId });
  if (!order)
    throw new customError.NotFound(`No order found with id: ${orderId}`);

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const userOrders = await orderModel.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ userOrders, count: userOrders.length });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1)
    throw new customError.BadRequest("No cart items provided!");

  if (!tax || !shippingFee)
    throw new customError.BadRequest("Please provide tax and shipping fee!");

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await productModel.findOne({ _id: item.product });

    if (!dbProduct)
      throw new customError.NotFound(`No product with id: ${item.product}`);

    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }

  const total = tax + shippingFee + subtotal;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const order = await orderModel.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await orderModel.findOne({ _id: orderId });
  if (!order)
    throw new customError.NotFound(`No order found with id: ${orderId}`);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

const getMnfOrders = async (req, res) => {
  const { mnfId } = req.params;
  const products = await productModel.find({ user: mnfId });
  const productId = products.map((product) => product._id);
  // console.log(productId);
  const orders = await orderModel
    .find({
      orderItems: { $elemMatch: { product: { $in: productId } } },
    })
    .lean();

  const userId = orders.map((order) => order.user);
  // console.log(userId);
  const users = await userModel.find({ _id: { $in: userId } });

  // const address = users.map((user) => {
  //   return { shopName: user.shopName, shopAddress: user.shopAddress };
  // });

  const userMap = users.reduce((map, user) => {
    map[user._id.toString()] = {
      shopName: user.shopName,
      shopAddress: user.shopAddress,
    };
    return map;
  }, {});

  // console.log(userMap);

  const ordersWithDetails = orders.map((order) => {
    const userDetails = userMap[order.user.toString()];
    return { ...order, ...userDetails };
  });

  res.status(StatusCodes.OK).json({ ordersWithDetails });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
  getMnfOrders,
};

// Pagination

// app.get("/posts", async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;
//   try {
//     const posts = await Posts.find()
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();
//     const count = await Posts.countDocuments();
//     res.json({
//       posts,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//     });
//   } catch (err) {
//     console.error(err.message);
//   }
// });
