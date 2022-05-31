import { useUser } from "@auth0/nextjs-auth0";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useFirebase } from "../../../contexts/firebase";

export default function Header({ selected }) {
  const { user } = useUser();
  const { contactData, userData } = useFirebase();

  const userId = useMemo(() => {
    return contactData[selected].userList.filter(
      (userId) => userId !== user.sub
    )[0];
  }, [contactData, selected]);

  const { avatar, name } = useMemo(() => {
    return userData[userId];
  }, [userId]);

  return (
    <Box sx={THEME.BOX}>
      {avatar && avatar.type === 0 ? (
        <img
          src={`https://avatars.dicebear.com/api/initials/${name}.svg`}
          alt=""
          style={THEME.AVATAR}
        />
      ) : (
        <img src={avatar.url} alt="" style={THEME.AVATAR} />
      )}
      <Typography sx={THEME.NAME}>{name}</Typography>
    </Box>
  );
}

const THEME = {
  BOX: {
    py: "10px",
    px: "35px",
    bgcolor: "background.default",
    display: "flex",
    alignItems: "center",
    boxShadow: 1,
  },
  AVATAR: {
    width: "40px",
    borderRadius: "50px",
    marginRight: "12px",
  },
  NAME: {
    fontWeight: "500",
    fontSize: "20px",
  },
};
