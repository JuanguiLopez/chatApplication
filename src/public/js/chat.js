const socket = io();

let userName;

//Elements
const userNameDiv = document.getElementById("userNameDiv");
const chatBox = document.getElementById("chatBox");
const messagesLog = document.getElementById("messagesLog");

//Event listener
chatBox.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    socket.emit("userMessage", {
      username: userName,
      message: e.target.value,
      time: new Date().toLocaleTimeString(),
    });
    e.target.value = "";
  }
});

//Socket events
socket.on("messages", ({ messages }) => {
  if (!userName) return;
  //console.log(messages);
  messagesLog.innerHTML = "";
  messages.forEach((m) => {
    messagesLog.innerHTML += `<br/>${m.time} ${m.username}: ${m.message}`;
  });
});

socket.on("newUser", ({ newUserName }) => {
  if (!userName) return;

  Swal.fire({
    title: `${newUserName} se ha unido al chat`,
    toast: true,
    position: "top-right",
    timer: 3000,
    showConfirmButton: false,
    icon: "success",
  });
});

//Alerts
Swal.fire({
  title: "Identificate",
  text: "Necesitas un nombre de usuario",
  input: "text",
  allowOutsideClick: false,
  inputValidator: (value) => {
    if (!value) {
      return "Necesitas un nombre de usuario para poder chatear";
    }
  },
}).then((result) => {
  //console.log(result);
  userName = result.value;
  userNameDiv.innerHTML = `User: ${userName}`;
  socket.emit("authenticated", { userName });
});
