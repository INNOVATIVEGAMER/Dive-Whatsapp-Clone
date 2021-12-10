import React, { useState } from "react";
import useAsyncEffect from "use-async-effect";
import { getFirebase } from "react-redux-firebase";
import { Divider, List } from "@material-ui/core";
import UserListItem from "./UserListItem";
import { connect } from "react-redux";

// Get all the users from firestre DB.
const getUsers = async () => {
  const firestore = getFirebase().firestore();
  const userRef = firestore.collection("users");
  try {
    // The Query will list the all the users in the firestore DB.
    let query;
    query = userRef;

    const querySnap = await query.get();
    let users = [];
    for (let index = 0; index < querySnap.docs.length; index++) {
      const user = {
        ...querySnap.docs[index].data(),
        id: querySnap.docs[index].id,
      };
      users.push(user);
    }

    return users;
  } catch (error) {
    console.log(error);
  }
};

const UserList = (props) => {
  const [users, setusers] = useState([]);
  const { auth } = props;

  // On component mount get all the users.
  useAsyncEffect(async (isMounted) => {
    const userDocs = await getUsers();

    if (!isMounted()) return;

    setusers(userDocs);
  }, []);

  return (
    <div>
      <List component="div" disablePadding>
        {users &&
          users.map((user) => (
            <div key={user.id}>
              {user.id !== auth?.uid && (
                <>
                  <UserListItem user={user} />
                  <Divider />
                </>
              )}
            </div>
          ))}
      </List>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.firebase.auth };
};

export default connect(mapStateToProps)(UserList);
