import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  const [tab, setTab] = useState("overview");

  if (!user) {
    return <div style={{ padding: "40px" }}>Not authorized</div>;
  }

  return (
    <div style={styles.container}>
      {/* LEFT MENU */}
      <div style={styles.sidebar}>
        <h3>My Account</h3>

        <button onClick={() => setTab("overview")}>
          Overview
        </button>

        <button onClick={() => setTab("orders")}>
          Orders
        </button>

        {user.roles?.includes("designer") && (
          <button onClick={() => setTab("models")}>
            My Models
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        {tab === "overview" && <Overview user={user} />}
        {tab === "orders" && <div>Orders coming soon...</div>}
        {tab === "models" && <div>Designer models coming soon...</div>}
      </div>
    </div>
  );
}

function Overview({ user }) {
  return (
    <div>
      <h2>Profile</h2>

      <p><b>Email:</b> {user.email}</p>

      <p>
        <b>Roles:</b>{" "}
        {user.roles?.length
          ? user.roles.join(", ")
          : "No roles"}
      </p>

      <p>
        <b>Status:</b> {user.isActive ? "Active" : "Inactive"}
      </p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    padding: "40px",
    gap: "30px",
  },
  sidebar: {
    width: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  content: {
    flex: 1,
  },
};