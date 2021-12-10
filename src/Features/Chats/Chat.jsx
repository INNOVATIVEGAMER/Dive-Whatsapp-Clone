import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import "./Chat.css";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { getFirebase } from "react-redux-firebase";
import useAsyncEffect from "use-async-effect";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";

const Chat = (props) => {
  // States.
  const [online, setonline] = useState(false);
  const [oppUser, setoppuser] = useState(null);
  const [lastOnline, setlastOnline] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Global Variables on the scope of this component.
  const { auth } = props;
  const { chatsId } = useParams();

  // There are various steps on component mount and change of the URL parameter chatsId.
  useAsyncEffect(
    async (isMounted) => {
      let oppuserdata = null;
      if (chatsId) {
        const firebase = getFirebase();
        const db = firebase.database();
        const oppUserId = chatsId.split("_")[1];

        // Get the profile info of the opposite user.
        const userDocRef = firebase
          .firestore()
          .collection("users")
          .doc(oppUserId);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) oppuserdata = userDoc.data();

        // Get the status of the opposite user.
        var userConnectionsRef = db.ref(`users/${oppUserId}/connections`);
        userConnectionsRef.on("value", async (userSnap) => {
          const numberOfConnections = userSnap.numChildren();

          if (numberOfConnections) setonline(true);
          else {
            db.ref(`users/${oppUserId}`).on("value", (snap) => {
              setlastOnline(snap.val().lastOnline);
            });
            setonline(false);
          }
        });

        // Get all messages of chat.
        var msgsRef = firebase
          .database()
          .ref(`users/${auth.uid}/chats/${oppUserId}`);

        msgsRef.on("value", async (snap) => {
          const msgsObj = await snap.val();
          let msgs = [];
          if (msgsObj) {
            msgs = Object.values(msgsObj);
          }
          setMessages(msgs);
        });

        // Set bluetick true if users loads the double tick messages in message body of the user who sent the message.
        // Remove the recieved msg from the recMsgs as user have seen the message.
        const recMsgRef = db.ref(`users/${auth.uid}/recMsg/`);
        recMsgRef.on("value", async (response) => {
          if (response.val()) {
            const recMsgs = Object.values(response.val());
            recMsgs.forEach(async (el) => {
              if (el.from === oppUserId) {
                const msgRef = db.ref(
                  `users/${el.from}/chats/${auth.uid}/${el.key}`
                );
                await msgRef.update({
                  blueTick: true,
                });

                await recMsgRef.child(el.id).remove();
              }
            });
          }
        });
      }

      if (!isMounted()) return;

      setoppuser(oppuserdata);
    },
    [chatsId]
  );

  const sendMessage = async (e) => {
    e.preventDefault();

    // Opposite User with which chatting is going on.
    const oppUserId = chatsId.split("_")[1];
    const firebase = getFirebase();
    const db = firebase.database();
    const chatsUserRef = db.ref(`users/${auth.uid}/chats/${oppUserId}`);
    const newSentMsgRefKey = await chatsUserRef.push().getKey();

    // Message sent by User itself.
    await chatsUserRef.child(newSentMsgRefKey).set({
      msg: input,
      from: auth.uid,
      singleTick: true,
      doubleTick: false,
      blueTick: false,
      timestamp: new Date().getTime(),
    });

    // Message sent to the User.
    const chatsOppUserRef = db.ref(`users/${oppUserId}/chats/${auth.uid}`);
    const newMsgRefKey = chatsOppUserRef.push().getKey();
    await chatsOppUserRef.child(newMsgRefKey).set({
      from: auth.uid,
      msg: input,
      timestamp: new Date().getTime(),
    });

    // If online, then true double tick at that instant.
    if (online) {
      await chatsUserRef.child(newSentMsgRefKey).update({
        doubleTick: true,
      });

      // As now this opposite user recieved the messages
      // These recieved messages will be stored in this users recMsgs.
      const recMsgRef = db.ref(`users/${oppUserId}/recMsg/`);
      const recMsgRefKey = await recMsgRef.push().getKey();
      await recMsgRef.child(recMsgRefKey).set({
        id: recMsgRefKey,
        from: auth.uid,
        key: newSentMsgRefKey,
      });
    } else {
      // Store new msgs in oppposite user new msgs.
      const newMsgRef = db.ref(`users/${oppUserId}/newMsg/`);
      await newMsgRef.push().set({
        from: auth.uid,
        key: newSentMsgRefKey,
      });
    }

    setInput("");
  };

  return (
    <div className="chat">
      {oppUser && (
        <div className="chat_header">
          <Avatar src={oppUser.photoURL} />
          <div className="chat_headerInfo">
            <h3 className="chat-opposite-user">{oppUser.displayName}</h3>
            {!online &&
              "Last Seen Online : " + new Date(lastOnline).toLocaleString()}
            {online && "Online"}
          </div>
        </div>
      )}
      <div className="chat_body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.from === auth.uid && "chat_receiver"
            }`}
            key={message.timestamp}
          >
            {message.msg}
            <span className="chat_status">
              {message.blueTick && (
                <span style={{ color: "#0000FF" }}>
                  <DoneAllIcon />
                </span>
              )}
              {!message.blueTick && message.doubleTick && (
                <span>
                  <DoneAllIcon />
                </span>
              )}
              {!message.blueTick && !message.doubleTick && message.singleTick && (
                <span>
                  <DoneIcon />
                </span>
              )}
            </span>
          </p>
        ))}
      </div>
      {oppUser && (
        <div className="chat_footer">
          <form>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Type a message"
            />
            <button type="submit" onClick={sendMessage}>
              Send a Message
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.firebase.auth };
};

export default connect(mapStateToProps)(Chat);
