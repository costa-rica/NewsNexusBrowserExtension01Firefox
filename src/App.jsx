import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

function App() {
  const [url, setUrl] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]?.url) {
        setUrl(tabs[0].url);
      }
    });
  }, []);

  return (
    <div style={{ padding: "1em", width: "100%" }}>
      <label htmlFor="url">URL</label>
      <input
        id="url"
        value={url}
        readOnly
        style={{ width: "100%", padding: "0.5em", marginTop: "0.5em" }}
      />
      <p style={{ marginTop: "1em", fontSize: "0.8em", color: "#888" }}>
        API Base: {apiUrl}
      </p>
    </div>
  );
}

export default App;
