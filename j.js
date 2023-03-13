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
    });

    console.log(populatedOrders);
    //     .populate("products.productId", "name price");

    // const ordersData = populatedOrders.map((order) => {
    //   const products = order.products.map((product) => ({
    //     name: product.productId.name,
    //     price: product.productId.price,
    //     quantity: product.quantity,
    //   }));
    //   return {
    //     orderNumber: order.orderNumber,
    //     orderDate: order.orderDate,
    //     products,
    //   };
    // });

    // const customerHistory = await HistoryModel.findOne({ customerId });

    // if (!customerHistory) {
    //   const newHistory = new HistoryModel({
    //     customerId,
    //     orders: ordersData.map((order) => order),
    //   });
    //   await newHistory.save();
    // } else {
    //   const newOrdersData = ordersData.map((order) => order);
    //   customerHistory.orders.push(newOrdersData);
    //   await customerHistory.save();
    // }

    // customerOrders.splice(0, customerOrders.length);
    // await foundCustomer.save();
  } catch (error) {
    throw new Error(error.message);
  }
}
