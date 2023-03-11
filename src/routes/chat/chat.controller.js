const CustomerModel = require("../../models/customer.model");

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

module.exports = {
  startChat,
};
