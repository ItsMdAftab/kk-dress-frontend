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
  { en: "Ankles", te: "ఆంకిల్స్" },
  { en: "Offer Tops", te: "ఆఫర్ టాప్స్" },
  { en: "Set's", te: "సెట్లు" },
  { en: "Other", te: "ఇతరాలు" }
];

/* =========================
   FIXED CATEGORY RATES
========================= */
const categoryDefaults = {
  Chunni: { code: "CK", price: 100 },
  Scarf: { code: "AK", price: 100 },
  Ankles: { code: "NAK", price: 250 },
  Leggings: { code: "NIK", price: 200 },
  "Offer Tops": { code: "SKK", price: 500 }
};

export default function WorkerSale({ username }) {

  const [language, setLanguage] = useState("en");
  const [count, setCount] = useState(1);
  const [sales, setSales] = useState([
    {
      category: "Other",
      code: "",
      price: "",
      paymentMode: "CASH",
      cashAmount: "",
      onlineAmount: ""
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* =========================
     HANDLE COUNT CHANGE
  ========================= */
  useEffect(() => {
    setSales(prev => {
      const copy = [...prev];
      while (copy.length < count) {
        copy.push({
          category: "Other",
          code: "",
          price: "",
          paymentMode: "CASH",
          cashAmount: "",
          onlineAmount: ""
        });
      }
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
     CATEGORY SELECT (AUTO FILL)
  ========================= */
  const selectCategory = (index, category) => {
    const defaults = categoryDefaults[category];

    setSales(s =>
      s.map((item, i) =>
        i === index
          ? {
              ...item,
              category,
              code: defaults ? defaults.code : "",
              price: defaults ? defaults.price : "",
              cashAmount:
                item.paymentMode === "CASH" && defaults ? defaults.price : "",
              onlineAmount:
                item.paymentMode === "ONLINE" && defaults ? defaults.price : ""
            }
          : item
      )
    );
  };

  /* =========================
     PAYMENT MODE
  ========================= */
  const setPaymentMode = (index, mode) => {
    setSales(s =>
      s.map((item, i) => {
        if (i !== index) return item;

        if (mode === "CASH") {
          return {
            ...item,
            paymentMode: "CASH",
            cashAmount: Number(item.price || 0),
            onlineAmount: 0
          };
        }

        if (mode === "ONLINE") {
          return {
            ...item,
            paymentMode: "ONLINE",
            cashAmount: 0,
            onlineAmount: Number(item.price || 0)
          };
        }

        return {
          ...item,
          paymentMode: "SPLIT",
          cashAmount: "",
          onlineAmount: ""
        };
      })
    );
  };

  /* =========================
     SUBMIT ALL SALES
  ========================= */
  const submitAll = async () => {
    if (loading) return;

    for (const s of sales) {
      if (!s.category || !s.code || !s.price) {
        setMessage(language === "en"
          ? "Please fill all fields"
          : "దయచేసి అన్ని వివరాలు నమోదు చేయండి"
        );
        return;
      }

      if (s.paymentMode === "SPLIT") {
        const total =
          Number(s.cashAmount || 0) + Number(s.onlineAmount || 0);

        if (total !== Number(s.price)) {
          setMessage(
            language === "en"
              ? "Cash + Online must equal Sold Price"
              : "నగదు + ఆన్‌లైన్ మొత్తం అమ్మిన ధరకు సమానం కావాలి"
          );
          return;
        }
      }
    }

    setLoading(true);
    setMessage("");

    try {
      const preparedItems = sales.map(s => {
        let cash = 0;
        let online = 0;

        if (s.paymentMode === "CASH") cash = Number(s.price);
        else if (s.paymentMode === "ONLINE") online = Number(s.price);
        else {
          cash = Number(s.cashAmount || 0);
          online = Number(s.onlineAmount || 0);
        }

        return {
          category: s.category,
          secretCode: s.code,
          soldPrice: Number(s.price),
          paymentMode: s.paymentMode,
          cashAmount: cash,
          onlineAmount: online
        };
      });

      const isSingle = preparedItems.length === 1;

      const url = isSingle
        ? "https://kk-dresses-backend.vercel.app/calculate-profit"
        : "https://kk-dresses-backend.vercel.app/calculate-profit/bulk";

      const payload = isSingle
        ? { soldBy: username, ...preparedItems[0] }
        : { soldBy: username, items: preparedItems };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(language === "en"
        ? "Sales added successfully ✅"
        : "అమ్మకాలు విజయవంతంగా నమోదు అయ్యాయి ✅"
      );

      setCount(1);
      setSales([{
        category: "Other",
        code: "",
        price: "",
        paymentMode: "CASH",
        cashAmount: "",
        onlineAmount: ""
      }]);

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sale-wrapper">
      <div className="sale-card">

        <img src={logo} alt="KK Dresses Logo" className="sale-logo" />

        <p style={{
          textAlign: "center",
          fontSize: 13,
          fontWeight: 600,
          marginTop: 4,
          color: "gold"
        }}>
          {localStorage.getItem("shop")}
        </p>

        <div className="sale-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 className="sale-title">
            {language === "en" ? "New Sale" : "కొత్త అమ్మకం"}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{username}</span>
            <LogoutButton language={language} />
          </div>
        </div>

        <div className="lang-toggle">
          <button
            className={`lang-btn ${language === "en" ? "active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            className={`lang-btn ${language === "te" ? "active" : ""}`}
            onClick={() => setLanguage("te")}
          >
            తెలుగు
          </button>
        </div>

        <p className="category-label">
          {language === "en" ? "Number of Items" : "వస్తువుల సంఖ్య"}
        </p>

        <select
          className="sale-input"
          value={count}
          onChange={e => setCount(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        {sales.map((sale, index) => (
          <div key={index} style={{ marginTop: 14 }}>

            <p className="category-label">Item {index + 1}</p>

            <div className="category-box">
              {categories.map(cat => (
                <button
                  key={cat.en}
                  className={`category-btn ${sale.category === cat.en ? "active" : ""}`}
                  onClick={() => selectCategory(index, cat.en)}
                >
                  {language === "en" ? cat.en : cat.te}
                </button>
              ))}
            </div>

            <input
              className="sale-input"
              placeholder="Secret Code"
              value={sale.code}
              onChange={e => updateSale(index, "code", e.target.value)}
            />

            <input
              className="sale-input"
              type="number"
              placeholder="Sold Price"
              value={sale.price}
              onChange={e => updateSale(index, "price", e.target.value)}
            />

            <p className="category-label">Payment Mode</p>
            <div className="category-box">
              {["CASH", "ONLINE", "SPLIT"].map(mode => (
                <button
                  key={mode}
                  className={`category-btn ${sale.paymentMode === mode ? "active" : ""}`}
                  onClick={() => setPaymentMode(index, mode)}
                >
                  {mode}
                </button>
              ))}
            </div>

            {sale.paymentMode === "SPLIT" && (
              <>
                <input
                  className="sale-input"
                  type="number"
                  placeholder="Cash Amount"
                  value={sale.cashAmount}
                  onChange={e => updateSale(index, "cashAmount", e.target.value)}
                />
                <input
                  className="sale-input"
                  type="number"
                  placeholder="Online Amount"
                  value={sale.onlineAmount}
                  onChange={e => updateSale(index, "onlineAmount", e.target.value)}
                />
              </>
            )}
          </div>
        ))}

        <button className="sale-submit" onClick={submitAll} disabled={loading}>
          {loading ? "Saving..." : "Submit Sale"}
        </button>

        {message && <p className="sale-message">{message}</p>}
      </div>
    </div>
  );
}
