import { useUser } from "@auth0/nextjs-auth0";
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFirebase } from "../../../contexts/firebase";

export default function Message({ selected }) {
  const { message } = useFirebase();
  const { user } = useUser();
  const messageBox = useRef();

  const [myMessage, setMyMessage] = useState([]);

  useEffect(() => {
    setMyMessage(message[selected]);
  }, [message, selected]);

  return (
    <Box sx={THEME.BOX} ref={messageBox}>
      {myMessage &&
        myMessage.map(({ content, sentBy, createdAt }, i) => {
          if (!content || !sentBy || !createdAt) return <div key={i}></div>;
          const createdAtTime = new Date(Number(createdAt));
          const year = createdAtTime.getFullYear();
          const month = createdAtTime.getMonth() + 1;
          const day = createdAtTime.getDate();
          const hour = createdAtTime.getHours();
          const min = createdAtTime.getMinutes();
          const renderableCreatedAt = `${hour}:${min} ${day}/${month}/${year}`;

          return (
            <Box
              sx={
                sentBy === user.sub ? THEME.MESSAGE_SENT_BY_ME : THEME.MESSAGE
              }
              key={i}
            >
              <Typography sx={THEME.MESSAGE_CONTENT}>{content}</Typography>
              <Typography sx={THEME.MESSAGE_CREATED_AT}>
                {renderableCreatedAt}
              </Typography>
            </Box>
          );
        })}

      <Typography sx={THEME.NO_MORE}>no more...</Typography>
    </Box>
  );
}

const THEME = {
  BOX: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    p: "10px",
    maxHeight: "calc(100vh - 64px - 40px - 20px - 56px - 30px - 4px)",
    overflowY: "auto",
    mt: "2px",
    mb: "2px",
  },
  MESSAGE: {
    maxWidth: "50%",
    alignSelf: "start",
    bgcolor: "background.default",
    p: "8px",
    mb: "5px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    whiteSpace: "pre-wrap",
  },
  get MESSAGE_SENT_BY_ME() {
    return {
      ...this.MESSAGE,
      alignSelf: "end",
      alignItems: "end",
    };
  },
  MESSAGE_CONTENT: {
    fontSize: "16px",
  },
  MESSAGE_CREATED_AT: {
    fontSize: "8px",
  },
  NO_MORE: {
    textAlign: "center",
  },
};
