import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import AddArticle from "./AddArticle.jsx";
import Login from "./Login.jsx";

// Reducer
import { Provider } from "react-redux";
import user from "./reducers/user";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const reducers = combineReducers({ user });

const persistConfig = { key: "newsnexus", storage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

function MainApp() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <AddArticle />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  //   <MainApp />
  // </StrictMode>
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MainApp />
      </PersistGate>
    </Provider>
  </StrictMode>
);
