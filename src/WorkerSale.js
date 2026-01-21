import { useState } from "react";
import LogoutButton from "./LogoutButton";
import "./WorkerSale.css";
import logo from "./assets/kk-dress-logo.png";

/* =========================
   BUTTON LOADER
========================= */
function ButtonLoader() {
  return <span className="btn-loader"></span>;
}

// Categories with English + Telugu
const categories = [
  { en: "Top", te: "టాప్" },
  { en: "Readymade Dress", te: "రెడీమేడ్ డ్రెస్" },
  { en: "Scarf", te: "స్కార్ఫ్" },
  { en: "Chunni", te: "చున్నీ" },
  { en: "Leggings", te: "లెగ్గింగ్స్" },
  { en: "Other", te: "ఇతరాలు" },
];

export default function WorkerSale({ username = "worker1" }) {
  const [language, setLanguage] = useState("en");
  const [category, setCategory] = useState("");
  const [code, setCode] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added

  const submitSale = async () => {
    if (loading) return; // prevent double submit

    if (!category || !code || !soldPrice) {
      setMessage(
        language === "en"
          ? "Please fill all fields"
          : "దయచేసి అన్ని వివరాలు నమోదు చేయండి"
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://kk-dresses-backend.vercel.app/calculate-profit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            secretCode: code,
            soldPrice: Number(soldPrice),
            soldBy: username,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(
          language === "en"
            ? "Sale added successfully ✅"
            : "అమ్మకం విజయవంతంగా నమోదు అయ్యింది ✅"
        );
        setCode("");
        setSoldPrice("");
        setCategory("");
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage(
        language === "en"
          ? "Server not responding"
          : "సర్వర్ స్పందించడం లేదు"
      );
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="sale-wrapper">
      <div className="sale-card">
        {/* HEADER */}
        <img src={logo} alt="KK Dresses Logo" className="sale-logo" />

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

        <p className="category-label">
          {language === "en" ? "Select Category" : "వర్గాన్ని ఎంచుకోండి"}
        </p>

        {/* CATEGORIES */}
        <div className="category-box">
          {categories.map((cat) => (
            <button
              key={cat.en}
              onClick={() => setCategory(cat.en)}
              disabled={loading}
              className={`category-btn ${
                category === cat.en ? "active" : ""
              }`}
            >
              {language === "en" ? cat.en : cat.te}
            </button>
          ))}
        </div>

        {/* INPUTS */}
        <input
          className="sale-input"
          placeholder={
            language === "en"
              ? "Secret Code (e.g. NOS)"
              : "సీక్రెట్ కోడ్ (ఉదా: NOS)"
          }
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
        />

        <input
          className="sale-input"
          placeholder={language === "en" ? "Sold Price" : "అమ్మిన ధర"}
          type="number"
          value={soldPrice}
          onChange={(e) => setSoldPrice(e.target.value)}
          disabled={loading}
        />

        {/* SUBMIT */}
        <button
          className="sale-submit"
          onClick={submitSale}
          disabled={loading}
        >
          {loading ? <ButtonLoader /> : language === "en" ? "Submit Sale" : "అమ్మకం నమోదు చేయండి"}
        </button>

        {message && !loading && (
          <p className="sale-message">{message}</p>
        )}
      </div>
    </div>
  );
}
