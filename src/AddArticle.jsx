import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import NavigationBar from "./common/NavigationBar";
import styles from "./styles/AddArticle.module.css";

function AddArticle() {
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
    <div className={styles.divMain}>
      <NavigationBar />

      <div className={styles.divMainMiddle}>
        <label className={styles.lblArticleDetailMain} htmlFor="url">
          URL
        </label>
        <input
          id="url"
          value={url}
          readOnly
          className={styles.inputArticleDetail}
        />
        <p>API Base: {apiUrl}</p>
      </div>
    </div>
  );
}

export default AddArticle;
