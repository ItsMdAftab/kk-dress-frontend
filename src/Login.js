import { useState } from "react";
import WorkerSale from "./WorkerSale";
import OwnerDashboard from "./OwnerDashboard";

export default function Login() {
  // 🔽 RESTORE SESSION (ADDED)
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [role, setRole] = useState(savedUser?.role || null);
  const [user, setUser] = useState(savedUser?.username || null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    const res = await fetch("https://kk-dresses-backend.vercel.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    // 🔽 STORE SESSION (ADDED)
    localStorage.setItem(
      "user",
      JSON.stringify({ role: data.role, username })
    );

    // 🔽 UPDATE STATE (ADDED)
    setRole(data.role);
    setUser(username);
  };

  // 🔽 ROLE BASED ROUTING (UPDATED)
  if (role === "OWNER") return <OwnerDashboard />;
  if (role === "WORKER") return <WorkerSale username={user} />;

  return (
    <div style={styles.container}>
      <h3>KK DRESSES</h3>

      <input
        style={styles.input}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={styles.button} onClick={login}>
        Login
      </button>

      <p style={{ color: "red" }}>{error}</p>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    height: "100vh",
    background: "#fff",
  },
  input: {
    padding: 12,
    marginBottom: 15,
    width: "100%",
  },
  button: {
    padding: 14,
    width: "100%",
    background: "#000",
    color: "#fff",
    border: "none",
  },
};
