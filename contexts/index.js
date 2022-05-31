import { UserProvider } from "@auth0/nextjs-auth0";
import FirebaseProvider from "./firebase";
import MUIProvider from "./mui";
import ProgressProvider from "./progress";

export default function ContextProvider({ children }) {
  return (
    <UserProvider>
      <ProgressProvider>
        <FirebaseProvider>
          <MUIProvider>{children}</MUIProvider>
        </FirebaseProvider>
      </ProgressProvider>
    </UserProvider>
  );
}
