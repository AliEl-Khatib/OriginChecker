import { createContext, useState } from "react";

const HomeAnalysisContext = createContext();

//Use a context prrovider to avoid prop drilling
export function HomeAnalysisProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [text, setText] = useState("");

  return (
    <HomeAnalysisContext.Provider
      value={{ loading, setLoading, result, setResult, text, setText }}
    >
      {children}
    </HomeAnalysisContext.Provider>
  );
}

export default HomeAnalysisContext