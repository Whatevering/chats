import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppBar from "../components/Home/AppBar";
import LoadingDialog from "../components/Home/LoadingDialog";
import { useState } from "react";
import { Box } from "@mui/material";
import ContactList from "../components/Home/ContactList";
import Chat from "../components/Home/Chat";
import { useProgress } from "../contexts/progress";

export default function Home() {
  const [selectedContact, setSelectedContact] = useState("");
  const { progress } = useProgress();

  return (
    <Box sx={THEME.BOX}>
      {progress < 100 && <LoadingDialog progress={progress} />}
      <AppBar />
      <Box sx={THEME.MAIN}>
        <ContactList
          selected={selectedContact}
          setSelected={setSelectedContact}
        />
        <Chat selected={selectedContact} />
      </Box>
    </Box>
  );
}

const THEME = {
  BOX: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
  MAIN: {
    display: "flex",
    flexGrow: "1",
  },
};

export const getServerSideProps = withPageAuthRequired();
