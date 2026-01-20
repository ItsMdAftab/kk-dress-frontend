import { useState } from "react";
import LogoutButton from "./LogoutButton";
import "./WorkerSale.css";
import logo from "./assets/kk-dress-logo.png";

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

  const submitSale = async () => {
    if (!category || !code || !soldPrice) {
      setMessage(
        language === "en"
          ? "Please fill all fields"
          : "దయచేసి అన్ని వివరాలు నమోదు చేయండి"
      );
      return;
    }

    const res = await fetch("https://kk-dresses-backend.vercel.app/calculate-profit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        secretCode: code,
        soldPrice: Number(soldPrice),
        soldBy: username,
      }),
    });

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
      setMessage(data.error);
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
        {language === "en" ? "Select Category" : "వర్గాన్ని ఎంచుకోండి"}
      </p>

      {/* CATEGORIES */}
      <div className="category-box">
        {categories.map((cat) => (
          <button
            key={cat.en}
            onClick={() => setCategory(cat.en)}
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
      />

      <input
        className="sale-input"
        placeholder={language === "en" ? "Sold Price" : "అమ్మిన ధర"}
        type="number"
        value={soldPrice}
        onChange={(e) => setSoldPrice(e.target.value)}
      />

      <button className="sale-submit" onClick={submitSale}>
        {language === "en" ? "Submit Sale" : "అమ్మకం నమోదు చేయండి"}
      </button>

      {message && <p className="sale-message">{message}</p>}
    </div>
  </div>
);

}

const styles = {
  container: {
    padding: 20,
    height: "100vh",
    background: "#fff",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  langBox: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  langBtn: {
    padding: "6px 12px",
    marginLeft: 6,
    border: "1px solid #000",
    background: "#fff",
    cursor: "pointer",
  },
  langActive: {
    padding: "6px 12px",
    marginLeft: 6,
    border: "1px solid #000",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
  },
  categoryBox: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  catBtn: {
    padding: "10px 12px",
    margin: 5,
    border: "none",
    borderRadius: 20,
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  submit: {
    width: "100%",
    padding: 14,
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 5,
  },
};
