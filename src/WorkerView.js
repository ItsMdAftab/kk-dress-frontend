import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

/* =========================
   LOADER
========================= */
function Loader() {
  return <div className="loader"></div>;
}

export default function WorkerView({ username, range }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;

    setLoading(true);

    fetch(
      `https://kk-dresses-backend.vercel.app/owner/worker-stats-full?username=${username}&range=${range}`
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result || []);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, [username, range]);

  return (
    <>
      <h4>Worker Performance</h4>

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

      {/* CHART */}
      {!loading && data.length > 0 && (
        <Bar
          data={{
            labels: data.map((d) => d.sold_by),
            datasets: [
              {
                label: "Sales Count",
                data: data.map((d) => d.count),
                backgroundColor: "#000",
              },
            ],
          }}
        />
      )}

      {/* NO DATA */}
      {!loading && data.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>
          No worker data available
        </p>
      )}

      {/* LIST */}
      {!loading &&
        data.map((d) => (
          <p key={d.sold_by}>
            {d.sold_by}: {d.count} sales | Profit ₹{d.profit}
          </p>
        ))}
    </>
  );
}
