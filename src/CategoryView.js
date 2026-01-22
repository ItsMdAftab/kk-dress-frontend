import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

/* =========================
   RANGE OPTIONS
========================= */
const ranges = ["today", "yesterday", "month", "year"];

/* =========================
   PASTEL COLORS
========================= */
const pastelColors = [
  "#F8BBD0", // light pink
  "#E1BEE7", // light purple
  "#FFCDD2", // light red
  "#FFF9C4", // light gold
  "#BBDEFB", // light blue
  "#C8E6C9", // light green
  "#D7CCC8", // light brown
  "#B2EBF2", // light cyan
];

/* =========================
   LOADER
========================= */
function Loader() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        border: "4px solid #eee",
        borderTop: "4px solid #000",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
}

/* =========================
   CATEGORY VIEW
========================= */
export default function CategoryView({ username }) {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("today");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(
  `https://kk-dresses-backend.vercel.app/owner/category-stats?username=${username}&range=${range}`
)

      .then(res => res.json())
      .then(result => {
  setData(Array.isArray(result) ? result : []);
  setLoading(false);
})

      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, [range]);

  /* =========================
     AUTO COLORS PER CATEGORY
  ========================= */
  const categoryColors = data.map(
    (_, index) => pastelColors[index % pastelColors.length]
  );

  return (
    <>
      <h4 style={{ marginBottom: 10 }}>Category Performance</h4>

      {/* RANGE BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
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
              fontSize: 13,
            }}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LOADER */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0",
          }}
        >
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
                backgroundColor: categoryColors,
                borderRadius: 8,
                barThickness: 40,
              },
            ],
          }}
          options={{
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "#ffffff",   // ✅ legend text color
        font: { size: 14, weight: "bold" },
      },
    },
    tooltip: {
      titleColor: "#fff",
      bodyColor: "#fff",
      backgroundColor: "rgba(0,0,0,0.8)",
    },
  },
  scales: {
    x: {
      ticks: {
        color: "grey",   // ✅ X-axis labels (Top, Other, etc.)
        font: {
          size: 13,
          weight: "bold",
        },
      },
      grid: {
        color: "rgba(255,255,255,0.15)", // subtle grid
      },
    },
    y: {
      ticks: {
        color: "#black",   // ✅ Y-axis ₹ values
        font: {
          size: 13,
          weight: "bold",
        },
        callback: value => `₹${value}`,
      },
      grid: {
        color: "rgba(255,255,255,0.15)",
      },
    },
  },
}}

        />
      )}

      {/* EMPTY STATE */}
      {!loading && data.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>
          No category data available
        </p>
      )}

      {/* CATEGORY CARDS */}
      {!loading && data.length > 0 && (
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {data.map((d, index) => (
            <div
              key={d.category}
              style={{
                background: pastelColors[index % pastelColors.length],
                padding: "12px 16px",
                borderRadius: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div>
                <b style={{ fontSize: 16 }}>{d.category}</b>
                <div style={{ fontSize: 13, color: "#333" }}>
                  {d.count} sales
                </div>
              </div>

              <div style={{ fontWeight: "bold", fontSize: 15 }}>
                ₹{d.profit}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SPINNER KEYFRAMES */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}
