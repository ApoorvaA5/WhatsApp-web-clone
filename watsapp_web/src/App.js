import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import "./App.css";
import Chat from "./Chat";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";

function App() {
  const [{ user }, dispatch] = useStateValue();
  console.log(user);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      dispatch({
        type: "SET_USER",
        user: user,
      });
    });
  }, []);
  return (
    <Router>
      <Switch>
        {!user ? (
          <Login />
        ) : (
          <div className="App">
            <div className="app_body">
                      <Sidebar />
           
      
              <Route exact path="/">
               <Chat />
              </Route>
              <Route path="/room/:roomId">
                     
                   <Chat />
              </Route>
            </div>
          </div>
        )}
      </Switch>
    </Router>
  );
}

export default App;
