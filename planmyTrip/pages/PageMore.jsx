import { Link } from "react-router";
import { lireRechercheVoyage } from "../services/stockageLocal.js";

export default function PageMore() {
  const rechercheVoyage = lireRechercheVoyage();
  const nomVille = rechercheVoyage?.nomVille;

  return (
    <main className="page-contenu">
      <section className="entete-page-categorie">
        <div>
          <p className="sur-ligne">Plus d'options</p>
          <h1>Allez encore plus loin dans votre projet</h1>
          <p>Explorez vos sélections, gérez vos réservations et retrouvez toutes les fonctionnalités pour un voyage sans stress.</p>
        </div>
      </section>

      <section className="grille-cartes-simples">
        <article className="carte-simple carte-simple--texte">
          <h2>Vos coups de cœur</h2>
          <p>Retrouvez ici tous les hébergements et activités que vous avez mis de côté pour plus tard.</p>
          <Link className="bouton-primaire" to="/wishlist">Ouvrir ma wishlist</Link>
        </article>

        <article className="carte-simple carte-simple--texte">
          <h2>Votre itinéraire</h2>
          <p>Consultez le récapitulatif complet de vos choix et gardez un œil sur votre budget en temps réel.</p>
          <Link className="bouton-primaire" to="/resume">Voir mon résumé</Link>
        </article>

        <article className="carte-simple carte-simple--texte">
          <h2>Continuer l'exploration</h2>
          <p>Reprenez vos recherches là où vous les avez laissées pour ne rien manquer de votre destination.</p>
          {nomVille ? (
            <Link className="bouton-primaire" to={`/ville/${encodeURIComponent(nomVille)}/hebergements`}>
              Retourner à {nomVille}
            </Link>
          ) : (
            <p className="texte-secondaire">Vous n'avez pas encore sélectionné de destination.</p>
          )}
        </article>
        <article className="carte-simple carte-simple--texte">
          <h2>Code sur Github</h2>

          <Link className="bouton-primaire" to="https://github.com/cegepmatane/projet-specialise-Abright17">Cliquer ici </Link>
        </article>
      </section>
    </main>
  );
}
