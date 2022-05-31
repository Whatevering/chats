import { useUser } from "@auth0/nextjs-auth0";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useMemo } from "react";
import { useFirebase } from "../../contexts/firebase";

export default function MyAppBar() {
  const { user } = useUser();
  const { userData } = useFirebase();

  const { avatar, name } =
    user && userData[user.sub] ? userData[user.sub] : { avatar: "", name: "" };

  return (
    <AppBar position="static">
      <Toolbar>
        <img src="/logo_white.svg" alt="" style={THEME.LOGO} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chats
        </Typography>
        {avatar && avatar.type === 0 ? (
          <img
            src={`https://avatars.dicebear.com/api/initials/${name}.svg`}
            alt=""
            style={THEME.AVATAR}
          />
        ) : (
          <img src={avatar.url} alt="" style={THEME.AVATAR} />
        )}
      </Toolbar>
    </AppBar>
  );
}

const THEME = {
  LOGO: {
    width: "34px",
    marginRight: "8px",
  },
  AVATAR: {
    width: "46px",
    borderRadius: "50px",
  },
};
