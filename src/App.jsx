import { useState } from "react";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return <Dashboard isDark={isDark} toggleDark={() => setIsDark((d) => !d)} />;
}