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

  useEffect(() => {
    const firebase = getFirebase();
    var userConnectionsRef = firebase
      .database()
      .ref(`users/${user.id}/connections`);
    userConnectionsRef.on("value", async (userSnap) => {
      const numberOfConnections = userSnap.numChildren();

      if (numberOfConnections) setonline(true);
      else setonline(false);
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
            {console.log(online)}
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
