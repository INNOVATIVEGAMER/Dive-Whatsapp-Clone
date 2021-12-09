import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from "../../Features/Chats/Chat";
import HomePage from "../../Features/Home/HomePage";
import Sidebar from "../../Features/Navigation/Sidebar";
import "./App.css";

const App = (props) => {
  const auth = props.auth;
  const authenticated = auth.isLoaded && !auth.isEmpty;
  return (
    <div className="app">
      {!authenticated ? (
        <HomePage />
      ) : (
        <div className="app_body">
          <Router>
            <Sidebar />
            <Switch>
              <Route path="/chats/:chatsId">
                <Chat />
              </Route>
              <Route path="/">
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.firebase.auth };
};

export default connect(mapStateToProps)(App);
