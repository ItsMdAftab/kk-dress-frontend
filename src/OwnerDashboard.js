import { useEffect, useState } from "react";
import "./dashboard.css";
import CategoryView from "./CategoryView";
import WorkerView from "./WorkerView";
import "./chartConfig";
import HistoryView from "./HistoryView";
import RegisterWorker from "./RegisterWorker";
import LogoutButton from "./LogoutButton";
import logo from "./assets/KK.png";
import WorkerSale from "./WorkerSale";

/* =========================
   COUNT-UP ANIMATION HOOK
========================= */
function useCountUp(value, duration = 600) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;

    if (end === 0) {
      setDisplay(0);
      return;
    }

    const increment = Math.ceil(end / (duration / 20));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplay(start);
    }, 20);

    return () => clearInterval(timer);
  }, [value, duration]);

  return display;
}

/* =========================
   LOADER
========================= */
function Loader() {
  return <div className="loader"></div>;
}

export default function OwnerDashboard() {
  const [view, setView] = useState("summary");
  const [range, setRange] = useState("today");
  const [loading, setLoading] = useState(false); // ✅ FIX
  const [summary, setSummary] = useState({
    sales: 0,
    profit: 0,
    count: 0
  });

  /* =========================
     FETCH SUMMARY
  ========================= */
  useEffect(() => {
    if (view === "summary") {
      setLoading(true); // ✅ start loading

      fetch(
        `https://kk-dresses-backend.vercel.app/owner/summary?range=${range}`
      )
        .then(res => res.json())
        .then(data => {
          setSummary(data);
          setLoading(false); // ✅ stop loading
        })
        .catch(() => {
          setSummary({ sales: 0, profit: 0, count: 0 });
          setLoading(false); // ✅ stop loading
        });
    }
  }, [view, range]);

  /* =========================
     ANIMATED VALUES
  ========================= */
  const animatedSales = useCountUp(summary.sales);
  const animatedProfit = useCountUp(summary.profit);
  const animatedCount = useCountUp(summary.count);

  return (
    <div className="container">

      {/* TOP BAR */}
      <div className="top-bar">
        <img src={logo} alt="KK Dresses Logo" className="dashboard-logo" />
        <LogoutButton />
      </div>

      {/* HEADER */}
      <div className="header">KK DRESSES — Owner</div>

      {/* MAIN TABS */}
      <div className="tabs">
        {[ "add-sale","summary", "category", "workers", "history", "add-worker"].map(v => (
          <button
            key={v}
            className={`tab ${view === v ? "active" : ""}`}
            onClick={() => setView(v)}
          >
            {v.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* RANGE TABS (CLEAN LIKE CATEGORY) */}
      {view === "summary" && (
        <div className="section">
          <div className="section-title">Summary Range</div>
          <div className="tabs range-tabs">
            {["today", "yesterday", "month", "year"].map(r => (
              <button
                key={r}
                className={`tab ${range === r ? "active" : ""}`}
                onClick={() => setRange(r)}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SUMMARY CARDS */}
      {view === "summary" && (
        <div className="cards">
          <div className="card">
            <div className="card-icon">₹</div>
            <h3>Sales</h3>
            <p>{loading ? <Loader /> : `₹ ${animatedSales}`}</p>
          </div>

          <div className="card">
            <div className="card-icon">📈</div>
            <h3>Profit</h3>
            <p>{loading ? <Loader /> : `₹ ${animatedProfit}`}</p>
          </div>

          <div className="card full">
            <div className="card-icon">🧾</div>
            <h3>Total Sales</h3>
            <p>{loading ? <Loader /> : animatedCount}</p>
          </div>
        </div>
      )}

    {view === "add-sale" && (
  <WorkerSale
    username="OWNER"
    role="owner"
  />
)}

{view === "category" && <CategoryView />}
{view === "workers" && <WorkerView />}
{view === "history" && <HistoryView role="owner" />}
{view === "add-worker" && <RegisterWorker />}

    </div>
  );
}
