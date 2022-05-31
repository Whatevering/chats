import { Box } from "@mui/material";
import Header from "./Header";
import Message from "./Message";
import SendBar from "./SendBar";

export default function Chat({ selected }) {
  return selected ? (
    <Box sx={THEME.BOX}>
      <Header selected={selected} />
      <Message selected={selected} />
      <SendBar selected={selected} />
    </Box>
  ) : (
    "please select"
  );
}

const THEME = {
  BOX: {
    flexGrow: 1,
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    bgcolor: "grey.50",
  },
};
