import { initializeApp } from "firebase/app";

import {
  collection,
  addDoc,
  getFirestore,
  onSnapshot,
  query,
  where,
  orderBy
}from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyBVlhYkCaQqSiNdsFNi-TDxkWvFpqPT1WE",
  authDomain: "realtime-chatroom-9552d.firebaseapp.com",
  projectId: "realtime-chatroom-9552d",
  storageBucket: "realtime-chatroom-9552d.appspot.com",
  messagingSenderId: "948645187165",
  appId: "1:948645187165:web:9ee71393557a502cfbc7b4"
};


const database = getFirestore(initializeApp(firebaseConfig))

class Chatroom {

  constructor (room, username) {
    this.room = room;
    this.username = username;
    this.unsub;
  }

  async addChat(message){
    const now = Date.now();
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: now
    };
    const response = await addDoc(collection(database, 'chats'), chat);
    return response;
  }

  getChats(callback){
    const q = query(collection(database, 'chats'), where('room', '==', this.room), orderBy('created_at'));
    this.unsub = onSnapshot(q, snapshot =>{
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          //upd ui
          callback(change.doc.data())
        }
      })
    })
  }
  updateName(username){
    this.username = username;
    console.log('name updated');
  }
  updateRoom(room){
    this.room = room;
    if(this.unsub) this.unsub();

    console.log('room updated');
  }
};



const chatroom = new Chatroom('game', 'lisa');

setTimeout(() =>{
  chatroom.updateRoom('general')
  chatroom.updateName('habibi')
  chatroom.getChats((data) =>console.log(data))
  chatroom.addChat('heey')
}, 2000)


export default Chatroom
