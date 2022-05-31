import { createContext, useContext, useState } from "react";

const ProgressContext = createContext();

export const useProgress = () => {
  return useContext(ProgressContext);
};

export default function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(0);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
