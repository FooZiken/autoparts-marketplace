import { useAuth } from "../auth/AuthContext";

export default function Navbar({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <h2
        style={{ cursor: "pointer" }}
        onClick={() => onNavigate("home")}
      >
        AutoParts 3D
      </h2>

      {/* NAV */}
      <div style={styles.right}>
        <button onClick={() => onNavigate("models")}>
          Catalog
        </button>

        <button onClick={() => onNavigate("about")}>
          About
        </button>

        {/* NOT AUTH */}
        {!user && (
          <>
            <button onClick={() => onNavigate("login")}>
              Login
            </button>

            <button onClick={() => onNavigate("register")}>
              Register
            </button>
          </>
        )}

        {/* AUTH */}
        {user && (
  <>
    <button
      style={styles.userBtn}
      onClick={() => onNavigate("profile")}
    >
      {user.email}
    </button>

    <button onClick={() => onNavigate("cart")}>
      Cart
    </button>

    <button onClick={logout}>
      Logout
    </button>
  </>
)}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#111",
    color: "#fff",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  user: {
    marginRight: "10px",
    cursor: "pointer",
    textDecoration: "underline",
  },

  userBtn: {
  background: "transparent",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  textDecoration: "underline",
},
};