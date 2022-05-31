import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../styles/globals.css";
import ContextProvider from "../contexts/index";

function Main({ children }) {
  return <>{children}</>;
}

export default function App({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Main>
        <Component {...pageProps} />
      </Main>
    </ContextProvider>
  );
}
