import React from "react";
import UserList from "./UserList";
import "./Sidebar.css";
import { Avatar, Box, Button } from "@material-ui/core";
import useAsyncEffect from "use-async-effect";
import { getFirebase } from "react-redux-firebase";
import { connect } from "react-redux";

const Sidebar = (props) => {
  const { auth } = props;

  // Setting the status of the user connections in fireabase realtime DB.
  const setStatus = () => {
    const firebase = getFirebase();
    const userId = props.auth.uid;
    var myConnectionsRef = firebase
      .database()
      .ref(`users/${userId}/connections`);
    var lastOnlineRef = firebase.database().ref(`users/${userId}/lastOnline`);

    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect).
        var con = myConnectionsRef.push();

        // When I disconnect, remove this device.
        con.onDisconnect().remove();

        // Add this device to my connections list.
        // this value could contain info about the device or a timestamp too.
        con.set(true);

        // When I disconnect, update the last time I was seen online.
        lastOnlineRef
          .onDisconnect()
          .set(firebase.database.ServerValue.TIMESTAMP);
      }
    });
  };

  // Calling setStatus methods on component mount
  useAsyncEffect(async (isMounted) => {
    if (!isMounted()) return;

    setStatus();
  }, []);

  // Logout user out of the application and remove all connections
  const handleLogout = async () => {
    const firebase = getFirebase();
    var myConnectionsRef = firebase
      .database()
      .ref(`users/${auth.uid}/connections`);

    await myConnectionsRef.remove();

    var lastOnlineRef = firebase.database().ref(`users/${auth.uid}/lastOnline`);
    // When LogOut, update the last time I was seen online.
    lastOnlineRef.set(firebase.database.ServerValue.TIMESTAMP);

    firebase.auth().signOut();
  };

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={auth?.photoURL} />
        <div className="sidebar_headerRight">
          <Box p="1rem">
            <strong>{auth.displayName}</strong>
          </Box>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleLogout}
          >
            LogOut
          </Button>
        </div>
      </div>
      <div className="sidebar_chats">
        <UserList />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.firebase.auth };
};

export default connect(mapStateToProps)(Sidebar);
