import { useEffect, useState } from "react";
import "./dashboard.css";
import CategoryView from "./CategoryView";
import WorkerView from "./WorkerView";
import "./chartConfig";
import HistoryView from "./HistoryView";
import RegisterWorker from "./RegisterWorker";
import LogoutButton from "./LogoutButton";


export default function OwnerDashboard() {
  const [view, setView] = useState("summary");
  const [range, setRange] = useState("today");
  const [summary, setSummary] = useState({ sales: 0, profit: 0, count: 0 });

  useEffect(() => {
    if (view === "summary") {
      fetch(`https:kk-dresses-backend.vercel.app
/owner/summary?range=${range}`)
        .then(res => res.json())
        .then(setSummary);
    }
  }, [view, range]);

  return (
    <div className="container">
      <div className="header">KK DRESSES — Owner</div>

      {/* VIEW BUTTONS */}
      <div className="tabs">
        <LogoutButton />

        {["summary", "category", "workers", "history","add-worker"].map(v => (
          <button
            key={v}
            className={`tab ${view === v ? "active" : ""}`}
            onClick={() => setView(v)}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      {/* RANGE BUTTONS */}
      {view === "summary" && (
        <div className="tabs">
          {["today", "yesterday", "month", "year"].map(r => (
            <button
              key={r}
              className={`tab ${range === r ? "active" : ""}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* SUMMARY VIEW */}
      {view === "summary" && (
        <div className="cards">
          <div className="card">
            <h3>Sales</h3>
            <p>₹ {summary.sales}</p>
          </div>
          <div className="card">
            <h3>Profit</h3>
            <p>₹ {summary.profit}</p>
          </div>
          <div className="card">
            <h3>Total Sales</h3>
            <p>{summary.count}</p>
          </div>
        </div>
      )}

      {view === "category" && <CategoryView />}
{view === "workers" && <WorkerView />}
{view === "history" && <HistoryView />}
{view === "add-worker" && <RegisterWorker />}


    </div>
  );
}
