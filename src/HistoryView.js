import { useEffect, useState } from "react";

export default function HistoryView() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("https:kk-dresses-backend.vercel.app/owner/sales-history")
      .then(res => res.json())
      .then(setHistory);
  }, []);

  return (
    <>
      <h4>Sales History</h4>

      {history.length === 0 && <p>No sales yet</p>}

      {history.map((h, i) => (
        <div key={i} style={card}>
          <div style={{ fontWeight: "bold" }}>{h.category}</div>

          <div>Sold Price: ₹{h.sold_price}</div>
          <div>Profit: ₹{h.profit}</div>

          <div style={{ fontSize: 12, color: "gray" }}>
            Sold by: {h.sold_by}
          </div>

          <div style={{ fontSize: 12, color: "gray" }}>
            {new Date(h.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </>
  );
}

const card = {
  background: "#fff",
  padding: 12,
  marginBottom: 10,
  borderRadius: 8,
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
};
