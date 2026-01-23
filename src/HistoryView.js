import { useEffect, useState } from "react";

/* =========================
   LOADER
========================= */
function Loader() {
  return <div className="loader"></div>;
}

export default function HistoryView({ role = "owner", username }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [range, setRange] = useState("today");

  const fetchHistory = () => {
    setLoading(true);

    fetch(
      `https://kk-dresses-backend.vercel.app/owner/sales-history?username=${username}&range=${range}`
    )
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        setHistory([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, [username, range]);

  /* =========================
     DELETE SALE
  ========================= */
  const deleteSale = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(
        `https://kk-dresses-backend.vercel.app/owner/delete-sale/${id}?username=${username}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHistory((h) => h.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete sale");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <h4>Sales History</h4>

      {/* RANGE BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <button
          onClick={() => setRange("today")}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            background: range === "today" ? "#198754" : "#ccc",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Today
        </button>

        <button
          onClick={() => setRange("yesterday")}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            background: range === "yesterday" ? "#198754" : "#ccc",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Yesterday
        </button>
      </div>

      {/* LOADER */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <Loader />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && history.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>No sales yet</p>
      )}

      {/* HISTORY CARDS */}
      {!loading &&
        history.map((h) => (
          <div key={h.id} style={card}>
            <div style={category}>{h.category}</div>

            <div style={secretCode}>Secret Code: {h.secret_code}</div>

            <div>Sold Price: ₹{h.sold_price}</div>
            <div>Profit: ₹{h.profit}</div>

            {/* PAYMENT DISPLAY */}
            <div
              style={{
                ...payment,
                color:
                  h.payment_mode === "CASH"
                    ? "#198754"
                    : h.payment_mode === "ONLINE"
                    ? "#0d6efd"
                    : "#6f42c1",
              }}
            >
              Payment:&nbsp;
              {h.payment_mode === "CASH" && <>💵 CASH ₹{h.cash_amount}</>}
              {h.payment_mode === "ONLINE" && <>📲 ONLINE ₹{h.online_amount}</>}
              {h.payment_mode !== "CASH" && h.payment_mode !== "ONLINE" && (
                <>
                  💵 ₹{h.cash_amount} + 📲 ₹{h.online_amount}
                </>
              )}
            </div>

            <div style={soldBy}>Sold by: {h.sold_by}</div>

            <div style={date}>
              {new Date(h.created_at).toLocaleString()}
            </div>

            {/* DELETE BUTTON */}
            {role === "owner" && (
              <button
                onClick={() => deleteSale(h.id)}
                disabled={deletingId === h.id}
                style={deleteBtn}
              >
                {deletingId === h.id ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        ))}
    </>
  );
}

/* =========================
   STYLES
========================= */

const card = {
  background: "#FFF5B8",
  padding: 16,
  marginBottom: 14,
  borderRadius: 14,
  border: "1px solid #d4edda",
  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
};

const category = {
  fontWeight: 700,
  fontSize: 18,
  marginBottom: 6,
  color: "#14532d",
};



const soldBy = {
  marginTop: 6,
  fontSize: 14,
  fontWeight: "600",
  color: "#333",
};

const secretCode = {
  fontSize: 12,
  fontWeight: "500",
  color: "#555",
  marginTop: 4,
};

const date = {
  fontSize: 15,
  color: "purple",
  marginTop: 6,
};

const deleteBtn = {
  marginTop: 12,
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: "600",
};

const payment = {
  marginTop: 6,
  fontSize: 14,
  fontWeight: "700",
};
