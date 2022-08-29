import { initializeApp } from "firebase/app";

import {
  getFirestore
}from 'firebase/firestore'

  const firebaseConfig = {
    apiKey: "AIzaSyBVlhYkCaQqSiNdsFNi-TDxkWvFpqPT1WE",
    authDomain: "realtime-chatroom-9552d.firebaseapp.com",
    projectId: "realtime-chatroom-9552d",
    storageBucket: "realtime-chatroom-9552d.appspot.com",
    messagingSenderId: "948645187165",
    appId: "1:948645187165:web:9ee71393557a502cfbc7b4"
  };

  initializeApp(firebaseConfig);

  const database = getFirestore()
