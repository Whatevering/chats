import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function LoadingDialog({ progress }) {
  return (
    <Box sx={THEME.BOX}>
      <img src="/logo.svg" alt="logo" style={THEME.LOGO} />
      <Typography variant="h4" sx={THEME.TITLE}>
        Welcome Back
      </Typography>
      <Box sx={THEME.PROGRESS}>
        <Box
          sx={{
            ...THEME.PROGRESS_BAR,
            width: `${progress}%`,
          }}
        />
      </Box>
    </Box>
  );
}

const THEME = {
  BOX: {
    position: "fixed",
    height: "100%",
    width: "100%",
    t: 0,
    l: 0,
    bgcolor: "blue.50",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  LOGO: {
    width: "150px",
    marginTop: "100px",
  },
  TITLE: {
    mt: "15px",
    fontWeight: 600,
  },
  PROGRESS: {
    mt: "20px",
    width: "200px",
    height: "5px",
    bgcolor: "background.default",
    borderRadius: "5px",
  },
  PROGRESS_BAR: {
    height: "100%",
    bgcolor: "primary.main",
    borderRadius: "5px",
    transition: "500ms",
  },
};
