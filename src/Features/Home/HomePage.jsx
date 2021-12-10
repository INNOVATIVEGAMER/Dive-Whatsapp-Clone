import { Box, Paper } from "@material-ui/core";
import React from "react";
import AuthenticationPanel from "../Panels/AuthenticationPanel";
import whatsAppLogo from "../../Assets/Icons/WhatsApp.png";

function HomePage() {
  return (
    <Paper elevation={3}>
      <Box p="5rem" style={{ textAlign: "center" }}>
        <img
          style={{ width: "4rem", display: "block", margin: "auto" }}
          src={whatsAppLogo}
          alt="WhatsappLogo"
        ></img>
        <h2>Whatsapp Clone - By Prasad</h2>
        <AuthenticationPanel />
      </Box>
    </Paper>
  );
}

export default HomePage;
