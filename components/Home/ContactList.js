import { Box, Typography, IconButton, ButtonBase } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AddContact from "./AddContact";
import { useState } from "react";
import { useFirebase } from "../../contexts/firebase";
import { useUser } from "@auth0/nextjs-auth0";

export default function ContactList({ selected, setSelected }) {
  const { user } = useUser();

  const [openAddContact, setOpenAddContact] = useState(false);
  const { contactList, contactData, userData } = useFirebase();

  return (
    <Box sx={THEME.BOX}>
      <Box sx={THEME.HEADER}>
        <Box sx={THEME.TITLE_WRAPPER}>
          <Typography sx={THEME.TITLE} variant="h5">
            Contact
          </Typography>
          <Typography sx={THEME.MY_FRIENDCODE}>
            FriendCode:{" "}
            {user && userData[user.sub] ? userData[user.sub].friendCode : ""}
          </Typography>
        </Box>

        <IconButton color="primary" onClick={() => setOpenAddContact(true)}>
          <AddOutlinedIcon />
        </IconButton>
        <AddContact open={openAddContact} setOpen={setOpenAddContact} />
      </Box>
      <Box sx={THEME.CONTACT_WRAPPER}>
        {contactList.map((contactId, i) => {
          const userId = contactData[contactId].userList.filter(
            (userId) => userId !== user.sub
          )[0];
          const name = userData[userId] ? userData[userId].name : "";
          const avatar = userData[userId] ? userData[userId].avatar : "";
          return (
            <ButtonBase
              key={i}
              sx={
                selected === contactId ? THEME.CONTACT_SELECTED : THEME.CONTACT
              }
              onClick={() => {
                console.log(contactId);
                setSelected(contactId);
              }}
            >
              {avatar && avatar.type === 0 ? (
                <img
                  src={`https://avatars.dicebear.com/api/initials/${name}.svg`}
                  alt=""
                  style={THEME.CONTACT_AVATAR}
                />
              ) : (
                <img src={avatar.url} alt="" style={THEME.CONTACT_AVATAR} />
              )}
              <Typography sx={THEME.CONTACT_TITLE}>{name}</Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}

const THEME = {
  BOX: {
    width: "25%",
    height: "100%",
    minWidth: "380px",
    maxWidth: "450px",
    boxShadow: 1,
    zIndex: 1,
  },
  HEADER: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    py: "10px",
    px: "20px",
    alignItems: "center",
    boxShadow: 1,
    mb: "1px",
  },
  TITLE_WRAPPER: {
    display: "flex",
    alignItems: "center",
  },
  TITLE: {
    fontWeight: "600",
    mr: "8px",
  },
  MY_FRIENDCODE: {
    bgcolor: "blue.50",
    px: "8px",
    borderRadius: "6px",
  },
  CONTACT: {
    width: "100%",
    py: "10px",
    px: "15px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "flex-start",
  },
  get CONTACT_SELECTED() {
    return {
      ...this.CONTACT,
      bgcolor: "grey.100",
    };
  },
  CONTACT_AVATAR: {
    width: "40px",
    borderRadius: "50px",
    marginRight: "8px",
  },
  CONTACT_TITLE: {
    fontWeight: "500",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
};
