import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import db from "./firebase";

export default function SidebarChat({ id, name, addnewchat }) {
  const [seed, setSeed] = useState("");
  const [lastmessage, setLastMessage] = useState("");
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));

    db.collection("rooms")
      .doc(id)
      .collection("message")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setLastMessage(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);

  console.log(lastmessage);

  const createChat = () => {
    const room = prompt("please enter room name.");
    // alert(room);
    if (room) {
      db.collection("rooms").add({
        name: room,
      });
    }
  };

  return !addnewchat ? (
    <Link
      style={{ color: "inherit", textDecoration: "inherit" }}
      to={`/room/${id}`}
    >
      <div className="sidebar_chat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebar_chatInfo">
          <h2>{name}</h2>
          <p>{lastmessage[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div className="sidebar_chat" onClick={createChat}>
      <h2>Add New Chat</h2>
    </div>
  );
}
