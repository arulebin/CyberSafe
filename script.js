document.addEventListener("DOMContentLoaded", function () {
  init("https://img.icons8.com/dotty/80/cyber-security.png");
});

let chatInput; // Declare chatInput in the global scope

function init(botLogoPath) {
  const chatContainer = document.getElementById("chat-container");

  const template = `
      <button class='chat-btn'>
          <img width="30" height="30" src="https://img.icons8.com/dotty/80/cyber-security.png" class="material-icon">
      </button>
      <div class='chat-popup'>
          <div class='chat-header'>
              <div class='chatbot-img'>
                  <img src='${botLogoPath}' alt='Chat Bot image' class='bot-img'> 
              </div>
              <h3 class='bot-title'>Cyber Bot</h3>
              <button class='close-chat-window'>&times;</button>
          </div>
          <div class='chat-area'>
              <div class='bot-msg'>
                  <img width="30" height="30" class='bot-img' src='${botLogoPath}' />
                  <span class='msg'>Hi, How can I help you?</span>
              </div>
          </div>
          <div class='chat-input-area'>
              <input type='text' autofocus class='chat-input' onkeypress='return givenUserInput(event)' placeholder='Type a message ...' autocomplete='off'>
              <button class='chat-submit'><i class='material-icons'>send</i></button>
          </div>
      </div>`;

  chatContainer.innerHTML = template;

  chatInput = document.querySelector(".chat-input"); // Initialize chatInput here

  const chatPopup = document.querySelector(".chat-popup");
  const chatBtn = document.querySelector(".chat-btn");
  const chatSubmit = document.querySelector(".chat-submit");
  const closeChatWindow = document.querySelector(".close-chat-window");

  chatBtn.addEventListener("click", () => {
      chatPopup.style.display = chatPopup.style.display === "none" || chatPopup.style.display === "" ? "flex" : "none";
  });

  closeChatWindow.addEventListener("click", () => {
      chatPopup.style.display = "none";
  });

  chatSubmit.addEventListener("click", async () => {
      const userResponse = chatInput.value.trim();
      if (userResponse !== "") {
          setUserResponse(userResponse);
          await send(userResponse);
      }
  });
}

function givenUserInput(e) {
  if (e.keyCode === 13) {
      const userResponse = chatInput.value.trim();
      if (userResponse !== "") {
          setUserResponse(userResponse);
          send(userResponse);
      }
      return false; // Prevent form submission if inside a form
  }
}

function setUserResponse(userInput) {
  const temp = `<div class="user-msg"><span class="msg">${userInput}</span></div>`;
  document.querySelector('.chat-area').innerHTML += temp;
  chatInput.value = ""; // Set the input value to an empty string
  scrollToBottomOfResults();
}

function scrollToBottomOfResults() {
  const chatArea = document.querySelector('.chat-area');
  chatArea.scrollTop = chatArea.scrollHeight;
}

const apiEndpoint = 'https://predict.cogniflow.ai/text/question-answering/ask/3d821d31-dfef-47c2-a818-2f8179f3fd76';
const apiKey = 'a616a610-f2ae-4454-b5ea-2f3adfefa5a3'; 
const botLogoPath = 'https://img.icons8.com/dotty/80/cyber-security.png'; // Ensure this path matches what you use in HTML

async function send(message) {
    chatInput.focus();
    console.log("User Message:", message);

    const requestData = {
        question: message,
        lang_code: 'en',
        id_session: 'unique-session-id'
    };

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(requestData)
        });

        const responseData = await response.json();
        console.log("API Response:", responseData); // Log the full response for debugging

        if (responseData) {
            setBotResponse(responseData.result[0].answer);
        } else {
            setBotResponse("I'm sorry, I didn't get that.");
        }
    } catch (error) {
        console.error('Error:', error);
        setBotResponse("Something went wrong. Please try again later.");
    }

    chatInput.focus();
}

function setBotResponse(response) {
    setTimeout(function() {
        const botResponse = `<div class='bot-msg'><img class='bot-img' src ='${botLogoPath}' /><span class='msg'>${response}</span></div>`;
        document.querySelector('.chat-area').innerHTML += botResponse;
        scrollToBottomOfResults();
    }, 500);
}
