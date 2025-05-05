import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import NavigationBar from "./common/NavigationBar";
import styles from "./styles/AddArticle.module.css";
import InputDropdownCheckbox from "./common/InputDropdownCheckbox";
import { useDispatch } from "react-redux";
import { updateNewArticle } from "./reducers/user";
import { useSelector } from "react-redux";

function AddArticle() {
  const userReducer = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [url, setUrl] = useState("");
  const [currentTabUrl, setCurrentTabUrl] = useState("");
  const [isStale, setIsStale] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [inputErrors, setInputErrors] = useState({});
  const [newArticle, setNewArticle] = useState(userReducer.newArticle);
  const [stateArray, setStateArray] = useState(userReducer.stateArray);

  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]?.url) {
        setUrl(tabs[0].url);
      }
    });
  }, []);

  const fetchCurrentTabUrl = async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tabs[0]?.url) {
      setCurrentTabUrl(tabs[0].url);
    }
  };

  useEffect(() => {
    fetchCurrentTabUrl();
    const interval = setInterval(fetchCurrentTabUrl, 1000); // Poll for tab changes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (url && currentTabUrl !== url) {
      setIsStale(true);
    } else {
      setNewArticle((prev) => {
        const result = { ...prev, url: currentTabUrl };
        dispatch(updateNewArticle(result));
        return result;
      });
      setIsStale(false);
    }
  }, [currentTabUrl]);

  const handleRefresh = async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tabs[0]?.url) {
      setUrl(tabs[0].url); // Update the tracked URL input
      setNewArticle((prev) => {
        const result = { ...prev, url: tabs[0].url };
        dispatch(updateNewArticle(result));
        return result;
      });
      setIsStale(false); // Remove yellow state
    }
  };

  const handleAddAndSubmitArticle = async () => {
    const selectedStateObjs = stateArray.filter((st) => st.selected);
    const errors = {
      publicationName: !newArticle.publicationName,
      title: !newArticle.title,
      publishedDate: !newArticle.publishedDate,
      content: !newArticle.content,
    };
    setInputErrors(errors);

    if (
      !newArticle.publicationName ||
      !newArticle.title ||
      !newArticle.publishedDate ||
      !newArticle.content ||
      !newArticle.url
    ) {
      alert(
        "Please fill in all required fields: publication name, title, published date, content, url"
      );
      return;
    }

    // Validation first
    if (selectedStateObjs.length === 0) {
      alert("Please select at least one state");
      return;
    }

    // Construct updated article
    const updatedArticle = {
      ...newArticle,
      stateObjArray: selectedStateObjs,
      isApproved: true,
      kmNotes: "added manually",
    };

    setNewArticle(updatedArticle);
    dispatch(updateNewArticle(updatedArticle));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/articles/add-article`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`,
          },
          body: JSON.stringify(updatedArticle),
        }
      );

      console.log(`Response status: ${response.status}`);
      let resJson = null;
      const contentType = response.headers.get("Content-Type");

      if (contentType?.includes("application/json")) {
        resJson = await response.json();
      }

      if (resJson) {
        console.log("Fetched Data:", resJson);
        if (response.status === 400) {
          alert(resJson.message);
          return;
        } else {
          // alert("Successfully added article");
          alert(`Successfully added article: ${resJson.newArticle.id}`);
          // setArticle({});
          const blankArticle = {
            publicationName: "",
            title: "",
            url: "",
            publishedDate: "",
            content: "",
            stateObjArray: [],
          };

          setNewArticle(blankArticle);
          dispatch(updateNewArticle(blankArticle));
          // Deselect all states
          setStateArray(userReducer.stateArray);
        }
      }
    } catch (error) {
      console.error("Error adding article:", error.message);
    }
    // fetchArticlesSummaryStatistics();
    // fetchArticlesArray();
  };

  return (
    <div className={styles.divMain}>
      <NavigationBar />

      <div className={styles.divMainMiddle}>
        {/* Publication Name */}
        <div className={styles.divArticleDetail}>
          <span className={styles.lblArticleDetailMain}>Publication Name:</span>
          <input
            type="text"
            value={newArticle?.publicationName || ""}
            className={`${inputErrors.publicationName ? "inputError" : ""} ${
              styles.inputArticleDetail
            }`}
            onChange={(e) =>
              setNewArticle((prev) => {
                const result = { ...prev, publicationName: e.target.value };
                dispatch(updateNewArticle(result));
                return result;
              })
            }
          />
        </div>
        {/* Title */}
        <div className={styles.divArticleDetail}>
          <span className={styles.lblArticleDetailMain}>Title:</span>
          <input
            type="text"
            value={newArticle?.title || ""}
            className={`${inputErrors.title ? "inputError" : ""} ${
              styles.inputArticleDetail
            }`}
            onChange={(e) =>
              setNewArticle((prev) => {
                const result = { ...prev, title: e.target.value };
                dispatch(updateNewArticle(result));
                return result;
              })
            }
          />
        </div>
        {/* URL */}
        <div className={styles.divArticleDetail}>
          <button onClick={handleRefresh} className={styles.btnSubmit}>
            {isStale ? "Refresh URL" : "URL"}
          </button>
          <input
            id="url"
            value={newArticle?.url || url}
            className={`${styles.inputArticleDetail} ${
              isStale ? styles.inputStale : ""
            }`}
            onChange={(e) =>
              setNewArticle((prev) => {
                const result = { ...prev, url: e.target.value };
                dispatch(updateNewArticle(result));
                return result;
              })
            }
          />
        </div>

        <div className={styles.divArticleDetail}>
          <span className={styles.lblArticleDetailMain}>Published Date:</span>
          <input
            type="date"
            value={newArticle?.publishedDate || ""}
            className={`${inputErrors.publishedDate ? "inputError" : ""} ${
              styles.inputArticleDetail
            }`}
            onChange={(e) =>
              setNewArticle((prev) => {
                const result = { ...prev, publishedDate: e.target.value };
                dispatch(updateNewArticle(result));
                return result;
              })
            }
          />
        </div>
        <div className={styles.divArticleDetail}>
          <span className={styles.lblArticleDetailMain}>Article State:</span>

          <div className={styles.divManageStates}>
            <InputDropdownCheckbox
              inputObjectArray={stateArray}
              setInputObjectArray={setStateArray}
              displayName="name"
              inputDefaultText="select states ..."
            />
          </div>
        </div>

        <div className={styles.divArticleDetailContent}>
          <span className={styles.lblArticleDetailMain}>Content:</span>
          <textarea
            value={newArticle?.content || ""}
            className={`${inputErrors.content ? "inputError" : ""} ${
              styles.inputArticleDetailContent
            }`}
            onChange={(e) => {
              const el = e.target;
              el.style.height = "auto"; // Reset height
              el.style.height = Math.min(el.scrollHeight, 160) + "px"; // Max 10rem = 160px

              setNewArticle((prev) => {
                const result = {
                  ...prev,
                  content: e.target.value,
                };
                dispatch(updateNewArticle(result));
                return result;
              });
            }}
          />
        </div>
        <div className={styles.divMainMiddleBottom}>
          {(newArticle?.publicationName ||
            newArticle?.title ||
            newArticle?.publishedDate ||
            newArticle?.content ||
            newArticle?.stateObjArray?.length > 0) && (
            <div className={styles.divMainMiddleBottomButtons}>
              <button
                className={styles.btnClear}
                onClick={() => {
                  setNewArticle(() => {
                    const result = {};
                    dispatch(updateNewArticle(result));
                    return result;
                  });
                }}
              >
                Clear
              </button>
            </div>
          )}
          <button
            className={styles.btnSubmit}
            onClick={() => {
              handleAddAndSubmitArticle();
            }}
          >
            Submit
          </button>
        </div>

        <div className={styles.divArticleDetail}>
          <p>API Base: {apiUrl}</p>
        </div>
      </div>
    </div>
  );
}

export default AddArticle;
