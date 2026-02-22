import { useState } from "react";
import user from "../data/user.json";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setSuccess(false);

    const ok =
      email.trim().toLowerCase() === user.email.toLowerCase() &&
      motDePasse === user.motDePasse;

    if (!ok) {
      setErreur("Email ou mot de passe incorrect.");
      return;
    }

    setSuccess(true);

    // Petit délai pour montrer "Connexion réussie"
    setTimeout(() => {
      onLogin({
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        budgetMax: user.budgetMax,
        nbPersonnesParDefaut: user.nbPersonnesParDefaut,
      });
    }, 600);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">PlanMyTrip</h1>
        <p className="login-subtitle">Connexion (prototype)</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="samuela@planmytrip.com"
            required
          />

          <label className="login-label">Mot de passe</label>
          <input
            className="login-input"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="test123"
            required
          />

          {erreur && <div className="login-error">{erreur}</div>}
          {success && <div className="login-success">Connexion réussie !</div>}

          <button className="login-btn" type="submit">
            Se connecter
          </button>

          <div className="login-demo">
            Compte démo : <b>{user.email}</b> / <b>{user.motDePasse}</b>
          </div>
        </form>
      </div>
    </div>
  );
}
