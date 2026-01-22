export default function LogoutButton({ language = "en" }) {
  const logout = () => {
    const confirmMsg =
      language === "en"
        ? "Are you sure you want to logout?"
        : "మీరు లాగ్ అవుట్ కావాలనుకుంటున్నారా?";

    if (!window.confirm(confirmMsg)) return;

    localStorage.removeItem("user");
  localStorage.removeItem("shop");
  window.location.reload();
  };

  return (
    <button onClick={logout} style={styles.logoutBtn}>
      {language === "en" ? "Logout" : "లాగ్ అవుట్"}
    </button>
  );
}

const styles = {
  logoutBtn: {
    padding: "6px 14px",
    backgroundColor: "#ff3b3b",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    fontSize: 13,
    cursor: "pointer",
    height: 32,
  },
};
