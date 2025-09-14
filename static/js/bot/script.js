const chatButton = document.getElementById("chatbot-button");
const chatContainer = document.getElementById("chatbot-container");
const chatClose = document.getElementById("chatbot-close");
const sendBtn = document.getElementById("chatbot-send");
const input = document.getElementById("chatbot-input");
const messages = document.getElementById("chatbot-messages");

if (chatButton) {
  chatButton.addEventListener("click", () => chatContainer.classList.remove("hidden"));
}
if (chatClose) {
  chatClose.addEventListener("click", () => chatContainer.classList.add("hidden"));
}
if (sendBtn) sendBtn.addEventListener("click", sendMessage);
if (input) {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message, "user-message");
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    addMessage("Assistant", data.reply, "bot-message");
  } catch (err) {
    addMessage("Assistant", "⚠ Error connecting to server.", "bot-message");
  }
}

function addMessage(sender, text, cssClass) {
  const msg = document.createElement("div");
  msg.className = `message ${cssClass}`;
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}
