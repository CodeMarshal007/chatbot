const chatForm = document.querySelector("#chat-form");

const chatScreen = document.querySelector(".chat-screen");

const socket = io();

socket.on("welcome", (serverMessage) => {
  welcomeMessage(serverMessage);

  chatScreen.scrollTop = chatScreen.scrollHeight;
});

socket.on("menu", (serverMessage) => {
  showMenu(serverMessage);

  chatScreen.scrollTop = chatScreen.scrollHeight;
});

socket.on("orderPlaced", (serverMessage) => {
  outputMessage(serverMessage);

  chatScreen.scrollTop = chatScreen.scrollHeight;
});

socket.on("checkout", (serverMessage) => {
  simpleMassage(serverMessage);

  chatScreen.scrollTop = chatScreen.scrollHeight;
});

socket.on("orderHistory", (serverMessage) => {
  orderHistory(serverMessage);

  chatScreen.scrollTop = chatScreen.scrollHeight;
});

//************************************************** */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;

  if (message === "1") {
    socket.emit("getMenu", "1");
  } else if (
    message === "100" ||
    message === "101" ||
    message === "102" ||
    message === "103" ||
    message === "104"
  ) {
    socket.emit("placeOrder", message);
  } else if (message === "99") {
    socket.emit("checkoutOrder", message);
  } else if (message === "98") {
    socket.emit("orderHistory", message);
  } else if (message === "97") {
    socket.emit("currentOrder", message);
  } else if (message === "0") {
    socket.emit("cancelOrder", "0");
  } else {
    socket.emit("chatMessage", message);
  }

  e.target.elements.message.value = "";
  e.target.elements.message.focus();
});

// *****************************************************/
function welcomeMessage(serverMessage) {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const messageList = document.querySelector("#message-list");
  const newMessageListItem = document.createElement("li");
  const userMessage = serverMessage;
  newMessageListItem.innerHTML = `
    <p id= "date">${date}</p>
  <div class="message">
    <p class="meta"> ${serverMessage.user} <span>${serverMessage.time}</span></p>
    <p class="text">
       ${serverMessage.msg}
    </p>
  </div>`;
  messageList.appendChild(newMessageListItem);
}

function outputMessage(serverMessage) {
  const messageList = document.querySelector("#message-list");

  const newMessageListItem = document.createElement("li");

  newMessageListItem.innerHTML = `
<div class="message">

  <p class="meta"> ${serverMessage.user} <span>${serverMessage.time}</span></p>

  <p class="text">
  Added to cart: </br>
  Ordered: ${serverMessage.msg.orderedItem}  </br>
  Price: ${serverMessage.msg.orderedPrice}</br>
Ordered on: ${serverMessage.msg.orderedAT}.
    </p>

</div>`;

  messageList.appendChild(newMessageListItem);
}

function showMenu(serverMessage) {
  const messageList = document.querySelector("#message-list");

  const newMessageListItem = document.createElement("li");

  const menu = [];
  serverMessage.msg.forEach((item) =>
    menu.push(
      "Select " + item.id + " to order " + item.name + ", " + " ₦" + item.price
    )
  );
  const menuItems = menu.map((menuItem) => `<br>${menuItem}`).join("");

  newMessageListItem.innerHTML = `
<div class="message">

  <p class="meta"> ${serverMessage.user} <span>${serverMessage.time}</span></p>
  <p>Please make your order:</p>
  <p class="text">
     ${menuItems}
  </p>

</div>`;

  messageList.appendChild(newMessageListItem);
}

function orderHistory(serverMessage) {
  const messageList = document.querySelector("#message-list");

  const newMessageListItem = document.createElement("li");

  const menu = [];
  let total = 0;

  serverMessage.msg.forEach((item) => {
    menu.push(item.id + "  " + item.name + ": " + " ₦" + item.price);
    total += parseFloat(item.price);
  });

  const menuItems = menu.map((menuItem) => `<br>${menuItem}`).join("");

  newMessageListItem.innerHTML = `
    <div class="message">
      <p class="meta">${serverMessage.user} <span>${serverMessage.time}</span></p>
      <p>Order history</p>
      <p class="text">
         ${menuItems}</br>
         total: ₦${total}
      </p>
    </div>`;

  messageList.appendChild(newMessageListItem);
}

function simpleMassage(serverMessage) {
  const messageList = document.querySelector("#message-list");

  const newMessageListItem = document.createElement("li");

  newMessageListItem.innerHTML = `
    <div class="message">
      <p class="meta">${serverMessage.user} <span>${serverMessage.time}</span></p>
      <p>${serverMessage.msg}</p>
     
    </div>`;

  messageList.appendChild(newMessageListItem);
}
