import { useEffect, useState } from "react";

/* =========================
   LOADER
========================= */
function Loader() {
  return <div className="loader"></div>;
}

export default function HistoryView() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch("https://kk-dresses-backend.vercel.app/owner/sales-history")
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        setHistory([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h4>Sales History</h4>

      {/* LOADER */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <Loader />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && history.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>
          No sales yet
        </p>
      )}

      {/* HISTORY LIST */}
      {!loading &&
        history.map((h, i) => (
          <div key={i} style={card}>
            <div style={category}>{h.category}</div>

            <div>Sold Price: ₹{h.sold_price}</div>
            <div>Profit: ₹{h.profit}</div>

            {/* SOLD BY – BIGGER */}
            <div style={soldBy}>
              Sold by: {h.sold_by}
            </div>

            {/* SECRET CODE */}
            <div style={secretCode}>
              Secret Code: {h.secret_code}
            </div>

            <div style={date}>
              {new Date(h.created_at).toLocaleString()}
            </div>
          </div>
        ))}
    </>
  );
}

/* =========================
   STYLES
========================= */

const card = {
  background: "#fff",
  padding: 14,
  marginBottom: 12,
  borderRadius: 10,
  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
};

const category = {
  fontWeight: "bold",
  fontSize: 16,
  marginBottom: 4,
};

const soldBy = {
  marginTop: 6,
  fontSize: 15,          // 👈 bigger
  fontWeight: "600",
  color: "#222",
};

const secretCode = {
  fontSize: 13,
  fontWeight: "500",
  color: "#0d6efd",      // 👈 highlight
  marginTop: 2,
};

const date = {
  fontSize: 12,
  color: "gray",
  marginTop: 4,
};
