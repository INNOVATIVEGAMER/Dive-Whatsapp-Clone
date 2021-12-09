import { Box, Button, Typography, withStyles } from "@material-ui/core";
import React, { Component } from "react";
import grey from "@material-ui/core/colors/grey";
import { getFirebase } from "react-redux-firebase";
import googleLogo from "../../Assets/Icons/google.svg";

const style = (theme) => ({
  root: {
    backgroundColor: "white",
    borderTop: "1px dotted #333",
    paddingTop: "2px",
  },
});

const GoogleButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(grey[100]),
    backgroundColor: grey[50],
    "&:hover": {
      backgroundColor: grey[300],
    },
    flex: 1,
  },
}))(Button);

class OAuthPanel extends Component {
  render() {
    const { classes } = this.props;
    const { socialLogin } = this.props;
    const firebase = getFirebase();
    return (
      <div className={classes.root}>
        <Box>
          <GoogleButton
            variant="contained"
            onClick={() => socialLogin({ firebase })}
          >
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
            >
              <img src={googleLogo} alt="google" />
              <Typography>
                <strong>Google</strong>
              </Typography>
            </Box>
          </GoogleButton>
        </Box>
      </div>
    );
  }
}

export default withStyles(style)(OAuthPanel);
