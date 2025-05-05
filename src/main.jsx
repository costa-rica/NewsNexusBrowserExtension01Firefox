import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import "./styles/globals.css";

import AddArticle from "./AddArticle.jsx";
import Login from "./Login.jsx";

// Reducer
import { Provider } from "react-redux";
import user from "./reducers/user";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateStateArray } from "./reducers/user";
import { useEffect } from "react";
const reducers = combineReducers({ user });

const persistConfig = { key: "newsnexus", storage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

function MainApp() {
  const userReducer = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log("userReducer.token:", userReducer.token);
  const fetchStateArray = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/states`
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text(); // Log response text for debugging
        throw new Error(`Server Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("Fetched Data (states):", result);

      if (result.statesArray && Array.isArray(result.statesArray)) {
        const tempStatesArray = result.statesArray.map((stateObj) => ({
          ...stateObj,
          selected: false,
        }));
        dispatch(updateStateArray(tempStatesArray));
      } else {
        dispatch(updateStateArray([]));
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      // dispatch(updateStateArray([]));
    }
  };

  useEffect(() => {
    fetchStateArray();
  }, []);

  return userReducer.token ? <AddArticle /> : <Login />;
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
