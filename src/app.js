import Chatroom from "./chat";
import ChatUI from "./ui";

const chatList = document.querySelector('.chat-list')

const chatUI = new ChatUI(chatList);
const chatroom = new Chatroom('general', 'lisa');

chatroom.getChats((data) => {
  chatUI.render(data)
})
