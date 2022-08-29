import "./database.js"

class Chatroom {
  constructor (room, username) {
    this.room = room;
    this.username = username;
    this.chats = database.collection('chats');
  }
  async addChat(message){
    const now = new Date();
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    };
    const response = await this.chats.add(chat);
    return response;
  }
};

const chatroom = new Chatroom('gaming', 'lisa');

chatroom.addChat('hello')
  .then(() => console.log('chat added'))
  .catch((err => console.log(err.message)))
