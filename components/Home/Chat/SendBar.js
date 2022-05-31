import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useFirebase } from "../../../contexts/firebase";
import { useEffect, useState } from "react";

export default function SendBar({ selected }) {
  const [input, setInput] = useState(``);
  const { sendMessage } = useFirebase();
  const [inputAllow, setInputAllow] = useState(false);

  useEffect(() => {
    if (input.trim().length) setInputAllow(true);
    else setInputAllow(false);
  }, [input]);

  const sendHandler = () => {
    sendMessage(selected, input);
    setInput("");
  };

  return (
    <Box sx={THEME.BOX}>
      <TextField
        variant="outlined"
        sx={THEME.INPUT}
        multiline={true}
        maxRows={5}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message"
      />
      <IconButton
        color="primary"
        size="large"
        onClick={sendHandler}
        sx={THEME.SEND_BUTTON}
        disabled={!inputAllow}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}

const THEME = {
  BOX: {
    py: "15px",
    px: "25px",
    bgcolor: "#fff",
    display: "flex",
    alignItems: "end",
  },
  INPUT: {
    flexGrow: 1,
    marginRight: "5px",
  },
  SEND_BUTTON: {
    minWidth: "56px",
    minHeight: "56px",
    maxWidth: "56px",
    maxHeight: "56px",
  },
};
