export default function Home({ user, onLogout }) {
  return (
    <div className="home-page">
      <header className="home-header">
        <div>
          <h1 className="home-title">Accueil</h1>
          <p className="home-subtitle">PlanMyTrip — Prototype</p>
        </div>

        <button className="home-logout" onClick={onLogout}>
          Déconnexion
        </button>
      </header>

      <section className="home-card">
        <h2 className="home-welcome">
          Bienvenue <span className="home-name">{user.prenom} {user.nom}</span>
        </h2>

        <ul className="home-infos">
          <li><b>Email :</b> {user.email}</li>
          <li><b>Budget max :</b> {user.budgetMax}$</li>
          <li><b>Nb personnes (défaut) :</b> {user.nbPersonnesParDefaut}</li>
        </ul>

        <p className="home-next">
          Connexion réussie. Prochaine étape : sélection d’hôtels/activités + affichage sur la carte.
        </p>
      </section>
    </div>
  );
}
