import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import "./WorkerSale.css";
import logo from "./assets/KK.png";

/* =========================
   CATEGORIES (EN + TE)
========================= */
const categories = [
  { en: "Top", te: "టాప్" },
  { en: "Readymade Dress", te: "రెడీమేడ్ డ్రెస్" },
  { en: "Scarf", te: "స్కార్ఫ్" },
  { en: "Chunni", te: "చున్నీ" },
  { en: "Leggings", te: "లెగ్గింగ్స్" },
  { en: "Set's", te: "సెట్లు" },
  { en: "Other", te: "ఇతరాలు" }
];

export default function WorkerSale({ username, role = "worker" }) {
  const [language, setLanguage] = useState("en");
  const [count, setCount] = useState(1);
  const [sales, setSales] = useState([
    { category: "", code: "", price: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* =========================
     HANDLE COUNT CHANGE
  ========================= */
  useEffect(() => {
    setSales(prev => {
      const copy = [...prev];
      while (copy.length < count)
        copy.push({ category: "", code: "", price: "" });
      return copy.slice(0, count);
    });
  }, [count]);

  const updateSale = (index, field, value) => {
    setSales(s =>
      s.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  /* =========================
     SUBMIT ALL SALES
  ========================= */
  const submitAll = async () => {
    if (loading) return;

    // basic validation
    for (const s of sales) {
      if (!s.category || !s.code || !s.price) {
        setMessage(
          language === "en"
            ? "Please fill all items"
            : "దయచేసి అన్ని వివరాలు నమోదు చేయండి"
        );
        return;
      }
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://kk-dresses-backend.vercel.app/calculate-profit/bulk",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            soldBy: role === "owner" ? "OWNER" : username,
            items: sales.map(s => ({
              category: s.category,
              secretCode: s.code,
              soldPrice: Number(s.price)
            }))
          })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(
        language === "en"
          ? "Sales added successfully ✅"
          : "అమ్మకాలు విజయవంతంగా నమోదు అయ్యాయి ✅"
      );
      setCount(1);
      setSales([{ category: "", code: "", price: "" }]);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sale-wrapper">
      <div className="sale-card">

        {/* LOGO */}
        <img src={logo} alt="KK Dresses Logo" className="sale-logo" />

        {/* HEADER */}
        <div className="sale-header">
          <h3 className="sale-title">
            {language === "en" ? "New Sale" : "కొత్త అమ్మకం"}
          </h3>
          <LogoutButton language={language} />
        </div>

        {/* LANGUAGE */}
        <div className="lang-toggle">
          <button
            className={`lang-btn ${language === "en" ? "active" : ""}`}
            onClick={() => setLanguage("en")}
            disabled={loading}
          >
            English
          </button>
          <button
            className={`lang-btn ${language === "te" ? "active" : ""}`}
            onClick={() => setLanguage("te")}
            disabled={loading}
          >
            తెలుగు
          </button>
        </div>

        {/* ITEM COUNT */}
        <p className="category-label">
          {language === "en" ? "Number of Items" : "వస్తువుల సంఖ్య"}
        </p>

        <select
          className="sale-input"
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          disabled={loading}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {/* SALE CARDS */}
        {sales.map((sale, index) => (
          <div key={index} style={{ marginTop: 12 }}>

            <p className="category-label">
              {language === "en"
                ? `Item ${index + 1} Category`
                : `వస్తువు ${index + 1}`}
            </p>

            <div className="category-box">
              {categories.map(cat => (
                <button
                  key={cat.en}
                  disabled={loading}
                  onClick={() =>
                    updateSale(index, "category", cat.en)
                  }
                  className={`category-btn ${
                    sale.category === cat.en ? "active" : ""
                  }`}
                >
                  {language === "en" ? cat.en : cat.te}
                </button>
              ))}
            </div>

            <input
              className="sale-input"
              placeholder={
                language === "en"
                  ? "Secret Code (e.g. NOS)"
                  : "సీక్రెట్ కోడ్"
              }
              value={sale.code}
              onChange={e =>
                updateSale(index, "code", e.target.value)
              }
              disabled={loading}
            />

            <input
              className="sale-input"
              type="number"
              placeholder={
                language === "en" ? "Sold Price" : "అమ్మిన ధర"
              }
              value={sale.price}
              onChange={e =>
                updateSale(index, "price", e.target.value)
              }
              disabled={loading}
            />
          </div>
        ))}

        {/* SUBMIT */}
        <button
          className="sale-submit"
          onClick={submitAll}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : language === "en"
            ? "Submit Sale"
            : "అమ్మకం నమోదు చేయండి"}
        </button>

        {message && !loading && (
          <p className="sale-message">{message}</p>
        )}
      </div>
    </div>
  );
}
