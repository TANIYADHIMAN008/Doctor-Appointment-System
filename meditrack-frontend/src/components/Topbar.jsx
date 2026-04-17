function Topbar() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{
      width: "100%",
      background: " light blue",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e2e8f0"
    }}>

      {/* 🔥 LOGO LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/logo.png" style={{ height: "30px" }} />
        <h3 style={{ margin: 0 }}>DocConnect</h3>
      </div>

      {/* USER RIGHT */}
      <div style={{ textAlign: "right" }}>
        <p style={{ fontWeight: "bold", margin: 0 }}>
          {user?.name || "User"}
        </p>
        <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
          {user?.email}
        </p>
      </div>

    </div>
  );
}

export default Topbar;