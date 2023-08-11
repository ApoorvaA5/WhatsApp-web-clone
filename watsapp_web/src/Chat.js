import { Avatar, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MicIcon from "@mui/icons-material/Mic";
import "./css/chat.css";
import { useParams } from "react-router-dom";
import db from "./firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useStateValue } from "./StateProvider";
function Chat() {
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (roomId) {
       
      db.collection("rooms")
      
        .doc(roomId)
    
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });
      db.collection("rooms")
        .doc(roomId)
        .collection("message")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [roomId]);
  console.log(messages);
  const sendMessage = (e) => {
    e.preventDefault();
    if (input === "") {
      return alert("please enter your message");
    }
    db.collection("rooms").doc(roomId).collection("message").add({
      name: user.displayName,
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };
  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>
            {new Date(
              messages[messages.length - 1]?.timestamp?.seconds * 1000
            ).toLocaleTimeString()}
          </p>
        </div>
        <div className="chat_right">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              user.displayName === message.name && "chat_reciever"
            }`}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_time">
              {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <EmojiEmotionsIcon />
        <AttachFileIcon />
        <form onSubmit={sendMessage}>
          <input
            id="message"
            value={input}
            type="text"
            placeholder="Type your message"
            onChange={(e) => setInput(e.target.value)}
          />
          <input id="submit" type="submit" />
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
