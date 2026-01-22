import { useState, useEffect } from "react";
import "./Login.css";
import WorkerSale from "./WorkerSale";
import OwnerDashboard from "./OwnerDashboard";
import logo from "./assets/KK.png";
import SelectShop from "./SelectShop";

/* =========================
   BUTTON LOADER
========================= */
function ButtonLoader() {
  return <span className="btn-loader"></span>;
}

export default function Login() {
  /* =========================
     CLEAR SESSION ON LOAD
  ========================= */
  useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const savedShop = localStorage.getItem("shop");

  if (savedUser && savedShop) {
    setRole(savedUser.role);
    setUser(savedUser.username);
  }
}, []);


  /* =========================
     SHOP SELECTION STATE
  ========================= */
  const [shopSelected, setShopSelected] = useState(false);
  const selectedShop = localStorage.getItem("shop");

  /* =========================
     USER SESSION STATE
  ========================= */
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  /* =========================
     LOGIN FORM STATE
  ========================= */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOGIN FUNCTION
  ========================= */
  const login = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    const shop = localStorage.getItem("shop");

    try {
      const res = await fetch(
        "https://kk-dresses-backend.vercel.app/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
            shop,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // ✅ NORMALIZE USERNAME ONCE
      const normalizedUsername = username.trim().toUpperCase();

      // ✅ STORE USER SESSION
      localStorage.setItem(
        "user",
        JSON.stringify({
          role: data.role,
          username: normalizedUsername,
        })
      );

      setRole(data.role);
      setUser(normalizedUsername);
    } catch {
      setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SHOP SELECTION PAGE
  ========================= */
  if (!shopSelected) {
    return <SelectShop onSelect={() => setShopSelected(true)} />;
  }

  /* =========================
     ROLE BASED ROUTING
  ========================= */
  if (role === "OWNER") return <OwnerDashboard username={user} />;
  if (role === "WORKER") return <WorkerSale username={user} />;

  /* =========================
     LOGIN UI
  ========================= */
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src={logo} alt="KK Group Logo" className="login-logo" />

        <h1 className="brand-name">KK GROUP</h1>
        <p className="brand-tagline">{selectedShop}</p>

        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          className="login-button"
          onClick={login}
          disabled={loading}
        >
          {loading ? <ButtonLoader /> : "Login"}
        </button>

        {error && !loading && (
          <p className="login-error">{error}</p>
        )}
      </div>
    </div>
  );
}
