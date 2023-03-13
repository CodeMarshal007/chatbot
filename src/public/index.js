const chatForm = document.querySelector("#chat-form");

const chatScreen = document.querySelector(".chat-screen");

const socket = io();

socket.on("welcome", (serverMessage) => {
  welcomeMessage(serverMessage);
});

socket.on("customerMessage", (serverMessage) => {
  customerMessage(serverMessage);
});

socket.on("menu", (serverMessage) => {
  showMenu(serverMessage);
});

socket.on("orderPlaced", (serverMessage) => {
  placeOrder(serverMessage);
});

socket.on("simpleMessage", (serverMessage) => {
  simpleMessage(serverMessage);
});

socket.on("orderHistory", (serverMessage) => {
  orderHistory(serverMessage);
});

//************************************************** */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;

  socket.emit("customerMessage", message);

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
  chatScreen.scrollTop = chatScreen.scrollHeight;
}

function placeOrder(serverMessage) {
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
    <p>Press 1 to place a new order</p>

</div>`;

  messageList.appendChild(newMessageListItem);
  chatScreen.scrollTop = chatScreen.scrollHeight;
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
  chatScreen.scrollTop = chatScreen.scrollHeight;
}

function orderHistory(serverMessage) {
  const messageList = document.querySelector("#message-list");

  serverMessage.msg.forEach((checkout) => {
    const newMessageListItem = document.createElement("li");
    const menu = [];
    let total = 0;

    checkout.forEach((item) => {
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
          Total: ₦${total}
        </p>
      </div>`;

    messageList.appendChild(newMessageListItem);
  });

  chatScreen.scrollTop = chatScreen.scrollHeight;
}

function simpleMessage(serverMessage) {
  const messageList = document.querySelector("#message-list");

  const newMessageListItem = document.createElement("li");

  newMessageListItem.innerHTML = `
    <div class="message">
      <p class="meta">${serverMessage.user} <span>${serverMessage.time}</span></p>
      <p>${serverMessage.msg}</p>
     
    </div>`;

  messageList.appendChild(newMessageListItem);
  chatScreen.scrollTop = chatScreen.scrollHeight;
}

function customerMessage(serverMessage) {
  const messageList = document.querySelector("#message-list");

  const newMessageListItem = document.createElement("li");

  newMessageListItem.innerHTML = `
    <div class="message">
      <p class="meta">${serverMessage.user} <span>${serverMessage.time}</span></p>
      <p>${serverMessage.msg}</p>
     
    </div>`;

  messageList.appendChild(newMessageListItem);
  chatScreen.scrollTop = chatScreen.scrollHeight;
}
