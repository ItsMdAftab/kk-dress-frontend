import { useState } from "react";
import "./Login.css";
import WorkerSale from "./WorkerSale";
import OwnerDashboard from "./OwnerDashboard";
import logo from "./assets/kk-dress-logo.png";

export default function Login() {
  // 🔽 RESTORE SESSION
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const [role, setRole] = useState(savedUser?.role || null);
  const [user, setUser] = useState(savedUser?.username || null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");

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

    localStorage.setItem(
      "user",
      JSON.stringify({ role: data.role, username })
    );

    setRole(data.role);
    setUser(username);
  };

  // 🔽 ROLE BASED ROUTING
  if (role === "OWNER") return <OwnerDashboard />;
  if (role === "WORKER") return <WorkerSale username={user} />;

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src={logo} alt="KK Dress Logo" className="login-logo" />
<h1 className="brand-name">KK DRESSES</h1>
<p className="brand-tagline">Fashion Shop</p>



        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={login}>
          Login
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
