import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import AddArticle from "./AddArticle.jsx";
import LoginScreen from "./LoginScreen.jsx";

function MainApp() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <AddArticle />
  ) : (
    <LoginScreen onLogin={() => setLoggedIn(true)} />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
