const CustomerModel = require("../models/customer.model");
const OrderModel = require("../models/order.model");
const MenuModel = require("../models/menu.model");
const HistoryModel = require("../models/orderHistory.model");

const moment = require("moment");
const { checkout } = require("../routes/chat/chat.router");

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
    msg: "BigBite</br > Hi welcome to BigBite!</br > Select 1 to place an order</br > Select 99 to checkout order</br > Select 98 to see order history</br >Select 97 to see current order</br > Select 0 to cancel order</br >",
    time: moment().format("h:mm a"),
  };
}

function mainMenu() {
  return {
    user: "Chatbot",
    msg: "<p>BigBite</p > Select 1 to place an order</br > Select 99 to checkout order</br > Select 98 to see order history</br >Select 97 to see current order</br > Select 0 to cancel order</br >",
    time: moment().format("h:mm a"),
  };
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
      orderedItem: foundMenuItemId._id.toString(),
      orderId: menuItemId,
      orderedBy: foundCustomer.userId,
    });
    foundCustomer.orders = foundCustomer.orders.concat(newOrder._id);

    await foundCustomer.save();

    return newOrder;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findOrderById(sessionid, orderid) {
  try {
    const orderId = orderid.toString();
    const sessionId = sessionid;

    const orderDetails = await MenuModel.findById(orderId);

    return orderDetails;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function checkoutOrder(customerId) {
  try {
    const foundCustomer = await CustomerModel.findOne({ userId: customerId });

    if (!foundCustomer) {
      throw new Error("Customer not found");
    }

    const customerOrders = foundCustomer.orders;
    if (customerOrders.length === 0) {
      console.log("You haven't placed any orders.");
      return [];
    }

    const populatedOrders = await OrderModel.find({
      _id: { $in: customerOrders },
    }).populate("orderedItem");

    const ordersData = populatedOrders.map((order) => {
      return {
        id: order.orderedItem.id,
        name: order.orderedItem.name,
        price: order.orderedItem.price,
        orderDate: order.orderedAT,
      };
    });

    const customerHistory = await HistoryModel.findOne({ customerId });

    if (!customerHistory) {
      const newHistory = new HistoryModel({
        customerId,
        orders: ordersData,
      });
      await newHistory.save();
    } else {
      const newOrdersData = ordersData.map((order) => order);
      customerHistory.orders.push(newOrdersData);
      await customerHistory.save();
    }

    customerOrders.splice(0, customerOrders.length);
    await foundCustomer.save();
  } catch (error) {
    throw new Error(error.message);
  }
}

async function orderHistory(sessionid) {
  const sessionId = sessionid;

  const foundCustomer = await HistoryModel.findOne({
    customerId: sessionid,
  });

  if (!foundCustomer) {
    return [];
  }

  return foundCustomer;
}

async function currentOrder(sessionid) {
  try {
    const customerId = sessionid;
    const foundCustomer = await CustomerModel.findOne({ userId: customerId });

    if (!foundCustomer) {
      throw new Error("Customer not found");
    }

    const customerOrders = foundCustomer.orders;
    if (customerOrders.length === 0) {
      console.log("You haven't placed any orders.");
      return [];
    }

    const populatedOrders = await OrderModel.find({
      _id: { $in: customerOrders },
    }).populate("orderedItem");

    const ordersData = populatedOrders.map((order) => {
      return {
        id: order.orderedItem.id,
        name: order.orderedItem.name,
        price: order.orderedItem.price,
        orderDate: order.orderedAT,
      };
    });
    return ordersData;
  } catch (error) {
    throw new Error(error.message);
  }
}
async function cancelOrder(sessionid) {
  try {
    const customerId = sessionid;
    const foundCustomer = await CustomerModel.findOne({ userId: customerId });

    if (!foundCustomer) {
      throw new Error("Customer not found");
    }

    const customerOrders = foundCustomer.orders;
    if (customerOrders.length === 0) {
      console.log("You haven't placed any orders.");
      return [];
    }
    customerOrders.splice(0, customerOrders.length);
    await foundCustomer.save();
    return [1];
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  formatMessage,
  welcomeCustomer,
  mainMenu,
  newOrder,
  getMenu,
  findOrderById,
  checkoutOrder,
  orderHistory,
  currentOrder,
  cancelOrder,
};
