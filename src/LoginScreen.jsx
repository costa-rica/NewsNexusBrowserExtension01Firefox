function LoginScreen({ onLogin }) {
  return (
    <div style={{ padding: "1em", width: "100%" }}>
      <h2>Welcome to NewsNexus</h2>
      <button onClick={onLogin} style={{ padding: "0.5em 1em" }}>
        Log In
      </button>
    </div>
  );
}

export default LoginScreen;
