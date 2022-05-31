import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFirebase } from "../../contexts/firebase";
import { LoadingButton } from "@mui/lab";

export default function AddContact({ open, setOpen }) {
  const { addContact } = useFirebase();

  const [friendCode, setFriendCode] = useState("");
  const [inputAllow, setInputAllow] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (friendCode.length >= 1) setInputError(false);
    if (friendCode.length === 8 && friendCode.trim().length)
      setInputAllow(true);
    else setInputAllow(false);
  }, [friendCode]);

  const handleClose = async (method) => {
    if (method === 1) {
      setLoading(true);
      const success = await addContact(friendCode);
      setLoading(false);
      setFriendCode("");
      if (success === -1) return setInputError(true);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => handleClose(0)}>
      <DialogTitle>Add Contact</DialogTitle>
      <DialogContent>
        <DialogContentText>Type his/her friendCode</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value)}
          label="FriendCode"
          type="text"
          variant="outlined"
          error={inputError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(0)}>Cancel</Button>
        <LoadingButton
          onClick={() => handleClose(1)}
          disabled={!inputAllow}
          loading={loading}
        >
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
