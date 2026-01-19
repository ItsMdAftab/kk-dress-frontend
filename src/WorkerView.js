import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function WorkerView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://kk-dresses-backend.vercel.app/owner/worker-stats-full")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <h4>Worker Performance</h4>
      <Bar
        key="worker-chart"

        data={{
          labels: data.map(d => d.sold_by),
          datasets: [
            {
              label: "Sales Count",
              data: data.map(d => d.count),
            },
          ],
        }}
      />

      {data.map(d => (
        <p key={d.sold_by}>
          {d.sold_by}: {d.count} sales | Profit ₹{d.profit}
        </p>
      ))}
    </>
  );
}
