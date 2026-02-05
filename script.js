async function sendMessage() {

  const input = document.getElementById("user-input");
  const message = input.value;

  addMessage("You: " + message);

  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();

  addMessage("AI: " + data.reply);

  input.value = "";
}

function addMessage(text) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += "<p>" + text + "</p>";
}
