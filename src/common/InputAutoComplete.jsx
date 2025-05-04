import React, { useState, useRef } from "react";
import styles from "../../styles/InputAutoComplete.module.css";

const suggestions = [
  "apple",
  "application",
  "banana",
  "blueberry",
  "grape",
  "grapefruit",
];

export default function InputAutoComplete() {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isInvalidInput, setIsInvalidInput] = useState(false);
  const inputRef = useRef(null);

  const findSuggestion = (text) => {
    if (!text) return "";
    const match = suggestions.find((word) => word.startsWith(text));
    return match && match !== text ? match : "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const match = findSuggestion(value);
    if (value && !match && !suggestions.includes(value)) {
      setIsInvalidInput(true);
      return; // prevent input update
    }
    setIsInvalidInput(false);
    setInput(value);
    // setSuggestion(findSuggestion(value));
    setSuggestion(match);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault(); // prevent tabbing away
      setInput(suggestion);
      setSuggestion("");
    }
  };

  return (
    <div className={styles.autocompleteWrapper}>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`${styles.autocompleteInput} ${
          isInvalidInput ? styles.invalidInput : ""
        }`}
      />
      <div className={styles.autocompleteGhost}>
        <span className={styles.invisibleText}>{input}</span>
        <span className={styles.ghostText}>
          {suggestion.slice(input.length)}
        </span>
      </div>
    </div>
  );
}
