import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setMessage("Login exitoso!");
      setIsLogged(true);
    } else {
      setMessage("Error: " + data.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMessage("Sesión cerrada.");
    setIsLogged(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>{isLogged ? "Bienvenido" : "Sign In"}</h2>
      {!isLogged ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <button type="submit">Sign In</button>
        </form>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
