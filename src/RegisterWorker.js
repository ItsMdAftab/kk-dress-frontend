import { useState } from "react";

export default function RegisterWorker() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const register = async () => {
    const res = await fetch("https://kk-dresses-backend.vercel.app/register-worker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setMsg(res.ok ? "Worker registered ✅" : data.error);
  };

  return (
    <div style={{ padding: 20 }}>
      <h4>Add Worker</h4>

      <input
        placeholder="Username"
        style={input}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        style={input}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={btn} onClick={register}>
        Register Worker
      </button>

      <p>{msg}</p>
    </div>
  );
}

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 10,
};

const btn = {
  width: "100%",
  padding: 12,
  background: "#000",
  color: "#fff",
  border: "none",
};
