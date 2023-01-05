import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  //email regex case insensitive
  const emailRegex = new RegExp(/^[a-zA-Z0-9._-]+@afpa.fr$/);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const data = {
      email,
      password,
    };
    if (emailRegex.test(email)) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch("http://localhost:5000/api/auth/login", options)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);

          if (data.error) {
            setError(data.error);
          } else {
            //check if token is valid
            setMessage(data.msg);
            //save token in local storage
            if (data.token) {
              localStorage.setItem("token", data.token);
              //redirect to home page
              window.location.href = "/";
            }
          }
        });
    } else {
      if (!emailRegex.test(email)) {
        setError("L'adresse email ne respecte pas le format");
      }
      setLoading(false);
    }
  };

  return (
    <div className="login_container">
      <div className="login_form">
        <div className="login_title">
          <h1>Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <div className="login_register">
          <p>
            Vous n'avez pas de compte ?{" "}
            <NavLink to="/register">Inscrivez-vous</NavLink>
          </p>
        </div>
      </div>
      <div className="login_error">{error && <p>{error}</p>}</div>
      <div className="login_message">{message && <p>{message}</p>}</div>
      <div className="login_loading">{loading && <p>Loading...</p>}</div>
    </div>
  );
};

export default Login;
