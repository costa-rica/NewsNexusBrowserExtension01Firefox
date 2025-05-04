import { useState } from "react";
import InputPassword from "./common/InputPassword";
import styles from "./styles/Login.module.css";
import { useDispatch } from "react-redux";
import { loginUser } from "./reducers/user";

export default function Login({ onBack }) {
  const dispatch = useDispatch();
  const [email, emailSetter] = useState(
    import.meta.env.VITE_ENVIRONMENT === "development"
      ? "nickrodriguez@kineticmetrics.com"
      : ""
  );
  const [password, passwordSetter] = useState(
    import.meta.env.VITE_ENVIRONMENT === "development" ? "test" : ""
  );
  const [requestResponseMessage, setRequestResponseMessage] = useState("");

  const handleClickLogin = async () => {
    console.log(
      "Login ---> API URL:",
      `${import.meta.env.VITE_API_BASE_URL}/users/login`
    );
    console.log("- handleClickLogin 👀");
    console.log("- email:", email);

    const bodyObj = { email, password };

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj),
      }
    );

    console.log("Received response:", response.status);

    let resJson = null;
    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
      resJson = await response.json();
    }

    if (response.ok) {
      // if (resJson.user.isAdminForKvManagerWebsite) {
      console.log(resJson);
      resJson.email = email;
      try {
        dispatch(loginUser(resJson));
        // router.push("/articles/get-from-api-services-detailed");
        setRequestResponseMessage(`succes: ${resJson.token}`);
      } catch (error) {
        console.error("Error logging in:", error.message);
        setRequestResponseMessage("There's a problem with the website");
      }
    } else {
      const errorMessage =
        resJson?.error || `There was a server error: ${response.status}`;
      // alert(errorMessage);
      setRequestResponseMessage(errorMessage);
    }
  };

  return (
    <div>
      <h2>News Nexus Extension Login</h2>
      <div className={styles.divEmailAndPassword}>
        <div className={styles.divInputGroup}>
          <label htmlFor="email">Email</label>
          <input
            className={styles.inputEmail}
            onChange={(e) => emailSetter(e.target.value)}
            value={email}
            type="email"
            placeholder="example@gmail.com"
          />
        </div>
        <InputPassword
          value={password}
          sendPasswordBackToParent={passwordSetter}
        />
        <button onClick={() => handleClickLogin}>Login</button>
      </div>
      <div className={styles.divRequestResponseMessage}>
        {requestResponseMessage}
      </div>
    </div>
  );
}
