import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const ranges = ["today", "yesterday", "month", "year"];

export default function CategoryView() {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("today");

  useEffect(() => {
    fetch(`https://kk-dresses-backend.vercel.app/owner/category-stats?range=${range}`)
      .then(res => res.json())
      .then(setData);
  }, [range]);

  return (
    <>
      <h4>Category Performance</h4>

      {/* RANGE BUTTONS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: "6px 12px",
              borderRadius: 20,
              border: "none",
              background: range === r ? "#000" : "#e0e0e0",
              color: range === r ? "#fff" : "#000",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* BAR CHART (PROFIT) */}
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

      {/* CATEGORY LIST */}
      {data.map(d => (
        <p key={d.category}>
          <b>{d.category}</b> — {d.count} sales | Profit ₹{d.profit}
        </p>
      ))}
    </>
  );
}
