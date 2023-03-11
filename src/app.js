const http = require("http");
const path = require("path");

const express = require("express");
const session = require("express-session");
const sharedsession = require("express-socket.io-session");
const socketio = require("socket.io");

const CONFIG = require("./config");
const connectToDB = require("./connectToDB");
const utils = require("./utils/messages");

const chatRouter = require("../src/routes/chat/chat.router");
const menuRouter = require("./routes/menu/menu.router");

const PORT = CONFIG.PORT || 8000;

const app = express();
connectToDB();

const server = http.createServer(app);
const io = socketio(server);

const sessionMiddleware = session({
  secret: CONFIG.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000, // Session cookie will expire after 1 hour in milliseconds
  },
});

app.use(sessionMiddleware);
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

io.on("connection", (socket) => {
  const sessionId = socket.handshake.session.id;

  socket.emit("welcome", utils.welcomeCustomer());

  //show menu
  socket.on("getMenu", async () => {
    const menu = await utils.getMenu();
    socket.emit("menu", utils.formatMessage("chatBot", menu));
  });

  socket.on("placeOrder", async (orderNumber) => {
    const orderId = +orderNumber;
    const newOrder = await utils.newOrder(sessionId, orderId);

    // look for the order and emit the name, price, time
    const createdOrder = await utils.findOrderById(sessionId, orderId);

    const orderInfo = await utils.getOrderInfo(createdOrder.orderedItem);

    const message = {
      orderedItem: orderInfo.name,
      orderedPrice: orderInfo.price,
      orderedAT: createdOrder.orderedAT,
    };

    socket.emit("orderPlaced", utils.formatMessage("Chatbot", message));
  });

  socket.on("checkoutOrder", async (message) => {
    let msg = "";
    const allUserOrders = await utils.orderHistory(sessionId);
    if (allUserOrders.length === 0) {
      msg = " No order to place. Press 1 to place a new order";
    } else {
      msg = "Order placed.";
    }

    socket.emit("checkout", utils.formatMessage("Chatbot", msg));
  });

  socket.on("orderHistory", async (message) => {
    const allUserOrders = await utils.orderHistory(sessionId);

    socket.emit("orderHistory", utils.formatMessage("Chatbot", allUserOrders));
  });

  socket.on("disconnect", () => {
    io.emit(
      "message",
      utils.formatMessage("Chatbot", "A user has disconnected")
    );
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
