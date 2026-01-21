import { useEffect, useState } from "react";
import "./dashboard.css";
import CategoryView from "./CategoryView";
import WorkerView from "./WorkerView";
import "./chartConfig";
import HistoryView from "./HistoryView";
import RegisterWorker from "./RegisterWorker";
import LogoutButton from "./LogoutButton";
import WorkerSale from "./WorkerSale";
import logo from "./assets/KK.png";
import { getUser } from "./auth";

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
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    sales: 0,
    profit: 0,
    count: 0,
    cash_total: 0,
    online_total: 0,
  });

  const user = getUser();
  const isAuthorized = user && user.role === "OWNER";
  const username = user?.username || "";

  /* =========================
     FETCH SUMMARY
  ========================= */
  useEffect(() => {
    if (!isAuthorized || view !== "summary") return;

    setLoading(true);

    fetch(
      `https://kk-dresses-backend.vercel.app/owner/summary?username=${username}&range=${range}`
    )
      .then((res) => res.json())
      .then((data) => {
        setSummary({
          sales: data.sales || 0,
          profit: data.profit || 0,
          count: data.count || 0,
          cash_total: data.cash_total || 0,
          online_total: data.online_total || 0,
        });
        setLoading(false);
      })
      .catch(() => {
        setSummary({
          sales: 0,
          profit: 0,
          count: 0,
          cash_total: 0,
          online_total: 0,
        });
        setLoading(false);
      });
  }, [view, range, username, isAuthorized]);

  const animatedSales = useCountUp(summary.sales);
  const animatedProfit = useCountUp(summary.profit);
  const animatedCount = useCountUp(summary.count);
  const animatedCash = useCountUp(summary.cash_total);
  const animatedOnline = useCountUp(summary.online_total);

  const renderView = () => {
    switch (view) {
      case "add-sale":
        return <WorkerSale username={username} role="owner" />;
      case "category":
        return <CategoryView username={username} />;
      case "workers":
        return <WorkerView username={username} />;
      case "history":
        return <HistoryView role="owner" username={username} />;
      case "add-worker":
        return <RegisterWorker ownerUsername={username} />;
      default:
        return null;
    }
  };

  if (!isAuthorized) {
    return <p style={{ padding: 20 }}>Unauthorized</p>;
  }

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
        {["add-sale", "summary", "category", "workers", "history", "add-worker"].map(v => (
          <button
            key={v}
            className={`tab ${view === v ? "active" : ""}`}
            onClick={() => setView(v)}
          >
            {v.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* RANGE TABS */}
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
        <div className="cards fade-in">
          <div className="card card-sales">
            <h3>Sales</h3>
            <p>{loading ? <Loader /> : `₹ ${animatedSales}`}</p>
          </div>

          <div className="card card-profit">
            <h3>Profit</h3>
            <p>{loading ? <Loader /> : `₹ ${animatedProfit}`}</p>
          </div>

          <div className="card card-cash">
            <h3>Cash</h3>
            <p>{loading ? <Loader /> : `₹ ${animatedCash}`}</p>
          </div>

          <div className="card card-online">
            <h3>Online</h3>
            <p>{loading ? <Loader /> : `₹ ${animatedOnline}`}</p>
          </div>

          <div className="card card-total full">
            <h3>Total Sales</h3>
            <p>{loading ? <Loader /> : animatedCount}</p>
          </div>
        </div>
      )}

      {/* OTHER VIEWS */}
      <div className="section">
        {renderView()}
      </div>
    </div>
  );
}
