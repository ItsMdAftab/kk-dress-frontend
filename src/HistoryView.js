import { useEffect, useState } from "react";

/* =========================
   LOADER
========================= */
function Loader() {
  return <div className="loader"></div>;
}

export default function HistoryView({ role = "owner" }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = () => {
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
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* =========================
     DELETE SALE
  ========================= */
  const deleteSale = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) {
      return;
    }

    setDeletingId(id);

    try {
      const res = await fetch(
        `https://kk-dresses-backend.vercel.app/owner/delete-sale/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // remove from UI instantly
      setHistory(h => h.filter(item => item.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete sale");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <h4>Sales History</h4>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <Loader />
        </div>
      )}

      {!loading && history.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>
          No sales yet
        </p>
      )}

      {!loading &&
        history.map((h) => (
          <div key={h.id} style={card}>
            <div style={category}>{h.category}</div>

            <div>Sold Price: ₹{h.sold_price}</div>
            <div>Profit: ₹{h.profit}</div>

            <div style={soldBy}>Sold by: {h.sold_by}</div>

            <div style={secretCode}>
              Secret Code: {h.secret_code}
            </div>

            <div style={date}>
              {new Date(h.created_at).toLocaleString()}
            </div>

            {/* DELETE BUTTON (OWNER ONLY) */}
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
  fontSize: 15,
  fontWeight: "600",
};

const secretCode = {
  fontSize: 13,
  fontWeight: "500",
  color: "#0d6efd",
  marginTop: 2,
};

const date = {
  fontSize: 12,
  color: "gray",
  marginTop: 4,
};

const deleteBtn = {
  marginTop: 10,
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
};
