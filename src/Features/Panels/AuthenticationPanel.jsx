import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import OAuthPanel from "./OAuthPanel";
import { socialLogin } from "../../Redux/Actions";
import { connect } from "react-redux";
import { Paper } from "@material-ui/core";

const styles = {
  root: { margin: "2rem 0" },
  panelsBg: {
    //backgroundColor: "#525255",
  },
};

class AuthenticationPanel extends Component {
  render() {
    const { classes, socialLogin } = this.props;
    return (
      <div className={classes.root}>
        <Paper>
          Sign in/Sign Up with Google
          <OAuthPanel socialLogin={socialLogin} />
        </Paper>
      </div>
    );
  }
}

const actions = {
  socialLogin,
};

export default connect(
  null,
  actions
)(withStyles(styles, { withTheme: true })(AuthenticationPanel));
