import { Avatar, IconButton } from "@mui/material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./css/sidebar.css";
import React, { useState, useEffect } from "react";
import SidebarChat from "./SidebarChat";
import db from "./firebase.js";
import {useStateValue} from './StateProvider';
import firebase from "firebase/compat/app";
function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const[{user}, dispatch]=useStateValue();
  useEffect(() => {
    db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user.photoURL} onClick={e=>firebase.auth().signOut()}/>
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>

          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchIcon />
          <input type="text" placeholder="Search or Start a new Chat" />
        </div>
      </div>
      <div className="sidebar_Chats">
        <SidebarChat addnewchat />
        {rooms.map(room=>{
          return <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        })}
        

      </div>
    </div>
  );
}

export default Sidebar;
