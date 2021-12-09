import React, { useState } from "react";
import useAsyncEffect from "use-async-effect";
import { getFirebase } from "react-redux-firebase";
import { Divider, List } from "@material-ui/core";

import UserListItem from "./UserListItem";

const getUsers = async () => {
  const firestore = getFirebase().firestore();
  const userRef = firestore.collection("users");
  try {
    let query;
    query = userRef.limit(10);

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
  const [usersStatus, setusersStatus] = useState({});

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
              <UserListItem user={user} />
              <Divider />
            </div>
          ))}
      </List>
    </div>
  );
};

export default UserList;
