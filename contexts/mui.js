import { ThemeProvider, createTheme } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";

export default function MUIProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

const theme = createTheme({
  palette: {
    primary: {
      main: blue["A400"],
    },
    secondary: {
      main: blue["A400"],
    },
    text: {
      default: "#000",
    },
    blue,
    grey,
  },
});
