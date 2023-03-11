const CustomerModel = require("../../models/customer.model");
const OrderModel = require("../../models/order.model");
const MenuModel = require("../../models/menu.model");

async function startChat(req, res, next) {
  try {
    const sessionId = req.session.id;

    const foundCustomer = await CustomerModel.find({ userId: sessionId });

    if (!foundCustomer.length > 0) {
      const newCustomer = await CustomerModel.create({
        userId: sessionId,
      });
    }
    res.render("index");
  } catch (error) {
    next(error);
  }
}

function customerOption(req, res, next) {
  // post not executing
  console.log("customerOp");
  const option = req.body;
  console.log({ option });
}

async function newOrder(req, res, next) {
  //   try {
  const userId = req.session.id;
  console.log({ userId });
  //     const newMessage = req.body;
  //     const menuItemId = 1;

  //     const foundCustomer = await CustomerModel.findOne({ userId: userId });
  //     if (!foundCustomer) {
  //       throw new Error("Customer not found");
  //     }

  //     const foundMenuItemId = await MenuModel.findOne({ id: menuItemId });
  //     if (!foundMenuItemId) {
  //       throw new Error("Menu item not found");
  //     }

  //     const newOrder = await OrderModel.create({
  //       orderedItem: foundMenuItemId.id,
  //       orderedBy: foundCustomer.userId,
  //     });

  //     console.log(newOrder._id);
  //     console.log(typeof newOrder._id);

  //     foundCustomer.orders = foundCustomer.orders.concat(newOrder._id);
  //     await foundCustomer.save();

  //     res.json({
  //       foundCustomer,
  //       foundMenuItemId,
  //       newOrder,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
}

module.exports = {
  startChat,
  customerOption,
  newOrder,
};
