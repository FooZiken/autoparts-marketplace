import { useState } from "react";
import { register, login } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
  const { login: loginContext } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isBuyer, setIsBuyer] = useState(true);
  const [isDesigner, setIsDesigner] = useState(false);

  const handleRegister = async () => {
    try {
      const roles = [];

      if (isBuyer) roles.push("buyer");
      if (isDesigner) roles.push("designer");

      // 1. регистрация
      await register({
        email,
        password,
        roles,
      });

      // 2. авто-логин
      await loginContext(email, password);

      alert("Registered and logged in!");
    } catch (e) {
      console.error(e);
      alert("Registration failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Register</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div>
        <label>
          <input
            type="checkbox"
            checked={isBuyer}
            onChange={() => setIsBuyer(!isBuyer)}
          />
          Buyer
        </label>

        <label>
          <input
            type="checkbox"
            checked={isDesigner}
            onChange={() => setIsDesigner(!isDesigner)}
          />
          Designer
        </label>
      </div>

      <button onClick={handleRegister}>
        Create account
      </button>
    </div>
  );
}