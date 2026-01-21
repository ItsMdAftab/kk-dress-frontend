import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const ranges = ["today", "yesterday", "month", "year"];

/* =========================
   LOADER
========================= */
function Loader() {
  return <div className="loader"></div>;
}

export default function CategoryView() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("today");
  const [loading, setLoading] = useState(false); // ✅ added

  useEffect(() => {
    setLoading(true); // start loading

    fetch(
      `https://kk-dresses-backend.vercel.app/owner/category-stats?range=${range}`
    )
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false); // stop loading
      })
      .catch(() => {
        setData([]);
        setLoading(false); // stop loading on error
      });
  }, [range]);

  return (
    <>
      <h4>Category Performance</h4>

      {/* RANGE BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              background: range === r ? "#000" : "#e0e0e0",
              color: range === r ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LOADER */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <Loader />
        </div>
      )}

      {/* BAR CHART */}
      {!loading && data.length > 0 && (
        <Bar
          key={`category-chart-${range}`}
          data={{
            labels: data.map(d => d.category),
            datasets: [
              {
                label: "Profit (₹)",
                data: data.map(d => d.profit),
                backgroundColor: "#000",
              },
            ],
          }}
        />
      )}

      {/* EMPTY STATE */}
      {!loading && data.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>
          No category data available
        </p>
      )}

      {/* CATEGORY LIST */}
      {!loading &&
        data.map(d => (
          <p key={d.category}>
            <b>{d.category}</b> — {d.count} sales | Profit ₹{d.profit}
          </p>
        ))}
    </>
  );
}
