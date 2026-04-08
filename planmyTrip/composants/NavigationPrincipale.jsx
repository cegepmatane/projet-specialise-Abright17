import { Link, NavLink, useNavigate } from "react-router";
import {
  lireRechercheVoyage,
  lireUtilisateurConnecte,
  supprimerUtilisateurConnecte,
} from "../services/stockageLocal.js";

export default function NavigationPrincipale() {
  const utilisateurConnecte = lireUtilisateurConnecte();
  const rechercheVoyage = lireRechercheVoyage();
  const navigate = useNavigate();

  const nomVille = rechercheVoyage?.nomVille || "";

  function deconnecterUtilisateur() {
    supprimerUtilisateurConnecte();
    navigate("/login");
  }

  return (
    <header className="navigation-principale">
      <div className="navigation-principale__barre-superieure">
        <div className="navigation-principale__gauche">
          <Link to="/" className="navigation-principale__marque">
            <span className="navigation-principale__marque-badge">PMT</span>
            <span>PlanMyTrip</span>
          </Link>
          <p className="navigation-principale__salutation">
            Bonjour {utilisateurConnecte?.prenom || "voyageur"}
          </p>
        </div>

        <nav className="navigation-principale__liens">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/more">More</NavLink>
        </nav>

        <button className="bouton-secondaire" type="button" onClick={deconnecterUtilisateur}>
          Déconnexion
        </button>
      </div>

      <div className="navigation-principale__barre-categories">
        <span className="navigation-principale__destination">
          {nomVille ? `Destination : ${nomVille}` : "Choisis une destination depuis l'accueil"}
        </span>

        {nomVille ? (
          <nav className="navigation-principale__categories">
            <NavLink to={`/ville/${encodeURIComponent(nomVille)}/hebergements`}>Hébergements</NavLink>
            <NavLink to={`/ville/${encodeURIComponent(nomVille)}/activites`}>Activités</NavLink>
            <NavLink to={`/ville/${encodeURIComponent(nomVille)}/restaurants`}>Restaurants</NavLink>
            <NavLink to={`/ville/${encodeURIComponent(nomVille)}/transports`}>Transports</NavLink>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
