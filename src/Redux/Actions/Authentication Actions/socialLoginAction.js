import history from "../../../history";
import { getFirebase } from "react-redux-firebase";

export const socialLogin = () => async (dispatch) => {
  try {
    const firebase = getFirebase();
    const user = await firebase.login({
      provider: "google",
      type: "popup",
    });

    if (user !== undefined && user.additionalUserInfo.isNewUser) {
      await firebase
        .firestore()
        .collection("users")
        .doc(user.user.uid)
        .set({
          displayName: user.user.displayName,
          email: user.user.email,
          photoURL: user.user.photoURL || null,
          createdAt: Date.now(),
          uid: user.user.uid,
        });
    }

    history.push("/main");
  } catch (error) {
    console.log(error);
  }
};
