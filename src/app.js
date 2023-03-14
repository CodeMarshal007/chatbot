const http = require("http");
const path = require("path");

const express = require("express");
const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);
const sharedsession = require("express-socket.io-session");
const socketio = require("socket.io");
const mongoose = require("mongoose");

const CONFIG = require("./config");
const connectToDB = require("./connectToDB");
const utils = require("./utils/messages");

const chatRouter = require("../src/routes/chat/chat.router");
const menuRouter = require("./routes/menu/menu.router");

const PORT = CONFIG.PORT || 8000;

const app = express();
const db = connectToDB();

// const sessionStore = new MongoStore({
//   mongooseConnection: db,
//   collection: "sessions",
// });

const server = http.createServer(app);
const io = socketio(server);

const sessionMiddleware = session({
  secret: CONFIG.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000, // Session cookie will expire after 1 hour in milliseconds
  },
  // store: new MongoStore({ mongooseConnection: mongoose.connection }),
});

app.use(sessionMiddleware);

// Listen for the "destroy" event on the session store
// const sessionStore = app.get("sessionStore");
// sessionStore.on("destroy", (sessionId) => {
//   // Remove session ID from Customer model
//   Customer.deleteOne({ sessionId }, (err) => {
//     if (err) console.error(err);
//   });

//   // Delete all orders associated with the session ID
//   Order.deleteMany({ sessionId }, (err) => {
//     if (err) console.error(err);
//   });
// });

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", chatRouter);
app.use("/menu", menuRouter);

io.use(
  sharedsession(sessionMiddleware, {
    autoSave: true,
  })
);

setTimeout(() => {}, 1000);

io.on("connection", (socket) => {
  const sessionId = socket.handshake.session.id;
  let msg;

  socket.emit("welcome", utils.welcomeCustomer());

  socket.on("mainMenu", () => {
    setTimeout(() => {
      socket.emit("mainMenu", utils.mainMenu());
    }, 500);
  });

  socket.on("customerMessage", (message) => {
    socket.emit("customerMessage", utils.formatMessage("customer", message));
  });

  //show menu
  socket.on("getMenu", async () => {
    const menu = await utils.getMenu();
    setTimeout(() => {
      socket.emit("menu", utils.formatMessage("chatBot", menu));
    }, 500);
  });

  socket.on("placeOrder", async (orderNumber) => {
    const orderId = +orderNumber;
    const newOrder = await utils.newOrder(sessionId, orderId);

    // look for the order and emit the name, price, time
    const createdOrder = await utils.findOrderById(
      sessionId,
      newOrder.orderedItem
    );

    const message = {
      orderedItem: createdOrder.name,
      orderedPrice: createdOrder.price,
      orderedAT: newOrder.orderedAT,
    };
    setTimeout(() => {
      socket.emit("orderPlaced", utils.formatMessage("Chatbot", message));
    }, 500);
  });

  socket.on("checkoutOrder", async (message) => {
    const cart = await utils.checkoutOrder(sessionId);
    if (cart && cart.length === 0) {
      msg = " No order to place.";
    } else {
      msg = "Order placed.";
    }
    setTimeout(() => {
      socket.emit("simpleMessage", utils.formatMessage("Chatbot", msg));
    }, 500);
  });

  socket.on("orderHistory", async (message) => {
    const orderHistory = await utils.orderHistory(sessionId);
    if (orderHistory.length === 0) {
      msg = "You don't have any order history.";
      setTimeout(() => {
        socket.emit("simpleMessage", utils.formatMessage("Chatbot", msg));
      }, 500);
      return;
    }

    const history = orderHistory.orders.map((order) => {
      return order;
    });
    setTimeout(() => {
      socket.emit("orderHistory", utils.formatMessage("Chatbot", history));
    }, 500);
  });

  socket.on("currentOrder", async () => {
    const currentOrder = await utils.currentOrder(sessionId);
    if (currentOrder.length === 0) {
      msg = "You don't have any order.";
      setTimeout(() => {
        socket.emit("simpleMessage", utils.formatMessage("Chatbot", msg));
      }, 500);

      return;
    }

    setTimeout(() => {
      socket.emit("currentOrder", utils.formatMessage("Chatbot", currentOrder));
    }, 500);
  });

  socket.on("cancelOrder", async () => {
    const currentOrder = await utils.cancelOrder(sessionId);
    if (currentOrder.length === 0) {
      msg = "You don't have any order.";
    } else {
      msg = "You have cancelled your order.";
    }

    setTimeout(() => {
      socket.emit("simpleMessage", utils.formatMessage("Chatbot", msg));
    }, 500);
  });

  socket.on("chatMessage", async () => {
    msg = "You have made an invalid selection";

    setTimeout(() => {
      socket.emit("simpleMessage", utils.formatMessage("Chatbot", msg));
    }, 500);
  });
});

// Error handler
app.use(function (error, req, res, next) {
  const errStatusCode = error.status || 500;
  const errMessage = error.message || "something broke";
  console.log(errMessage);

  res.status(errStatusCode).json({ success: false, message: errMessage });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}...`);
});
