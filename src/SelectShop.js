import "./Login.css"; // reuse same styling
import logo from "./assets/KK.png";

export default function SelectShop({ onSelect }) {
  const selectShop = (shop) => {
    // save selected shop
    localStorage.setItem("shop", shop);

    // go to login page
    onSelect();
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src={logo} alt="KK Group" className="login-logo" />

        <h1 className="brand-name">WELCOME TO KK GROUP</h1>
        <p className="brand-tagline">Select Your Shop</p>

        <button
          className="login-button"
          onClick={() => selectShop("KK-DRESS")}
        >
          KK DRESS
        </button>

        <button
          className="login-button"
          onClick={() => selectShop("RK-DRESS")}
          style={{ marginTop: 10 }}
        >
          RK DRESS
        </button>

        <button
          className="login-button"
          onClick={() => selectShop("RK-FASHION")}
          style={{ marginTop: 10 }}
        >
          RK FASHION
        </button>
      </div>
    </div>
  );
}
