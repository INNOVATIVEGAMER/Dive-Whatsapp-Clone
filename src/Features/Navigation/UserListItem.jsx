import {
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getFirebase } from "react-redux-firebase";
import { Link } from "react-router-dom";

const UserListItem = (props) => {
  const [online, setonline] = useState(false);
  const { user, auth } = props;

  // On component mount set the user status & check for messages.
  useEffect(() => {
    const firebase = getFirebase();
    var userConnectionsRef = firebase
      .database()
      .ref(`users/${user.id}/connections`);
    userConnectionsRef.on("value", async (userSnap) => {
      const numberOfConnections = userSnap.numChildren();

      if (numberOfConnections) {
        // Check if there are newMsgs
        const db = firebase.database();
        const newMsgRef = db.ref(`users/${user.id}/newMsg/`);
        const response = await newMsgRef.get();
        if (response.val()) {
          const newMsgs = Object.values(response.val());

          // Foreach newMsg report the sender that this user got the message.
          // Set the doubleTick true in message body of the user who sent the message.
          newMsgs.forEach(async (el) => {
            const msgRef = db.ref(
              `users/${el.from}/chats/${user.id}/${el.key}`
            );
            await msgRef.update({
              doubleTick: true,
            });

            // As now this user recieved the messages
            // These recieved messages will be stored in this users recMsgs
            const recMsgRef = db.ref(`users/${user.id}/recMsg/`);
            const recMsgRefKey = await recMsgRef.push().getKey();
            await recMsgRef.child(recMsgRefKey).set({
              id: recMsgRefKey,
              from: el.from,
              key: el.key,
            });
          });
          await newMsgRef.remove();
        }
        setonline(true);
      } else setonline(false);
    });
  }, []);

  return (
    <div>
      <Link to={"/chats/" + auth.uid + "_" + user.id}>
        <ListItem button>
          <ListItemIcon>
            <Avatar alt={user.displayName} src={user.photoURL} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body1" color="textSecondary">
              <strong>{user.displayName}</strong>
            </Typography>
            {online && (
              <Typography variant="body2" color="primary">
                Online
              </Typography>
            )}
            {!online && (
              <Typography variant="body2" color="secondary">
                Offline
              </Typography>
            )}
          </ListItemText>
        </ListItem>
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.firebase.auth };
};

export default connect(mapStateToProps)(UserListItem);
