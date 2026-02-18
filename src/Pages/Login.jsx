import { useState } from "react";
import user from "../data/user.json";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setErreur("");

    const ok =
      email.trim().toLowerCase() === user.email.toLowerCase() &&
      motDePasse === user.motDePasse;

    if (!ok) {
      setErreur("Email ou mot de passe incorrect.");
      return;
    }
    onLogin({
      id: user.id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      budgetMax: user.budgetMax,
      nbPersonnesParDefaut: user.nbPersonnesParDefaut,
    });
  }

  return (
    <div >
      <div >
        <h1 >PlanMyTrip</h1>
        <p >Connexion (prototype)</p>

        <form onSubmit={handleSubmit} >
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="samuela@planmytrip.com"
            required
          />

          <label>Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            placeholder="test123"
            required
          />

          {erreur && <div>{erreur}</div>}

          <button type="submit">
            Se connecter
          </button>

          <div>
            Compte démo : <b>{user.email}</b> / <b>{user.motDePasse}</b>
          </div>
        </form>
      </div>
    </div>
  );
}


