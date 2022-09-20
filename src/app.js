// import
import { initializeApp } from "firebase/app"
import {
  collection,
  addDoc,
  getFirestore,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore"

// selectors
const chatList = document.querySelector(".chat-list")
const newChatForm = document.querySelector(".new-chat")
const newNameForm = document.querySelector(".new-name")
const rooms = document.querySelector(".chat-rooms")

// fb config and init
const firebaseConfig = {
  apiKey: "AIzaSyBVlhYkCaQqSiNdsFNi-TDxkWvFpqPT1WE",
  authDomain: "realtime-chatroom-9552d.firebaseapp.com",
  projectId: "realtime-chatroom-9552d",
  storageBucket: "realtime-chatroom-9552d.appspot.com",
  messagingSenderId: "948645187165",
  appId: "1:948645187165:web:9ee71393557a502cfbc7b4",
}

const database = getFirestore(initializeApp(firebaseConfig))

// classes
class Chatroom {
  constructor(room, username) {
    this.room = room
    this.username = username
    this.unsub
  }

  async addChat(message) {
    const now = new Date()
    const time = `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}  ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: time,
    }
    const response = await addDoc(collection(database, "chats"), chat)
    return response
  }

  getChats(callback) {
    const q = query(
      collection(database, "chats"),
      where("room", "==", this.room),
      orderBy("created_at")
    )
    this.unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          //upd ui
          callback(change.doc.data())
        }
      })
    })
  }
  updateName(username) {
    this.username = username
    console.log("name updated")
  }
  updateRoom(room) {
    this.room = room
    if (this.unsub) this.unsub()

    console.log("room updated")
  }
}

class ChatUI {
  constructor(list) {
    this.list = list
  }
  clear() {
    this.list.innerHTML = ""
  }

  render(data) {
    const html = `
    <li class="list-group-item">
    <strong><span class="username">${data.username}:</span></strong>
    <span class="message">${data.message}</span>
    <div class="time">${data.created_at}</div>
    </li>
    `
    this.list.innerHTML += html
  }
}

// create objects

const chatUI = new ChatUI(chatList)
const chatroom = new Chatroom("general", "anon")

// event listeners

newChatForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const message = newChatForm.message.value.trim()
  chatroom
    .addChat(message)
    .then(() => newChatForm.reset())
    .catch((err) => console.log("Error: ", err.message))
})

newNameForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const name = newNameForm.name.value.trim()
  chatroom.updateName(name)
  newNameForm.reset()
})

rooms.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    chatUI.clear()
    chatroom.updateRoom(e.target.getAttribute("id"))
    chatroom.getChats((chat) => chatUI.render(chat))
  }
})

chatroom.getChats((data) => {
  chatUI.render(data)
})
