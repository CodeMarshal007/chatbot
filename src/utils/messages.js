const CustomerModel = require("../models/customer.model");
const OrderModel = require("../models/order.model");
const MenuModel = require("../models/menu.model");

const moment = require("moment");

function formatMessage(user, msg) {
  return {
    user,
    msg,
    time: moment().format("h:mm a"),
  };
}

function welcomeCustomer() {
  return {
    user: "Chatbot",
    msg: "Hi welcome to BigBite!</br > Select 1 to place an order</br > Select 99 to checkout order</br > Select 98 to see order history</br >Select 97 to see current order</br > Select 0 to cancel order</br >",
    time: moment().format("h:mm a"),
  };
}

async function newOrder(sessionId, customerOption) {
  try {
    const userId = sessionId;

    const menuItemId = customerOption;

    const foundCustomer = await CustomerModel.findOne({ userId: userId });
    if (!foundCustomer) {
      throw new Error("Customer not found");
    }

    const foundMenuItemId = await MenuModel.findOne({ id: menuItemId });
    if (!foundMenuItemId) {
      throw new Error("Menu item not found");
    }

    const newOrder = await OrderModel.create({
      orderedItem: foundMenuItemId.id,
      orderedBy: foundCustomer.userId,
    });

    foundCustomer.orders = foundCustomer.orders.concat(newOrder._id);

    await foundCustomer.save();

    return {
      newOrder,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getMenu() {
  try {
    const menu = await MenuModel.find();
    if (!menu.length > 0) {
      console.log("Menu is empty");
    }
    return menu;
  } catch (error) {}
}

async function findOrderById(sessionid, orderid) {
  try {
    const orderId = orderid;
    const sessionId = sessionid;
    const order = await OrderModel.findOne({ orderedItem: orderId })
      .where("orderedBy")
      .equals(sessionId);

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getOrderInfo(orderid) {
  try {
    const orderId = orderid;

    const orderDetails = await MenuModel.findOne({ id: orderId });

    return orderDetails;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function orderHistory(sessionid) {
  const sessionId = sessionid;

  const allUserOrders = await OrderModel.find({ orderedBy: sessionId });
  if (allUserOrders.length === 0) {
    console.log("You haven't placed any orders.");
    return [];
  }

  const orders = [];
  for (const order of allUserOrders) {
    const orderInfo = await MenuModel.findOne({ id: order.orderedItem });
    orders.push(orderInfo);
  }

  return Promise.all(orders);
}

module.exports = {
  formatMessage,
  welcomeCustomer,
  newOrder,
  getMenu,
  findOrderById,
  getOrderInfo,
  orderHistory,
};
