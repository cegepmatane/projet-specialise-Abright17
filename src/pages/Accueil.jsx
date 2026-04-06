import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ajouterRechercheHistorique,
  evenementsPlanMyTrip,
  lireHistoriqueRecherche,
  lireResumeVoyage,
  lireUtilisateurConnecte,
  sauvegarderRechercheVoyage,
  sauvegarderResumeVoyage,
} from "../services/stockageLocal.js";
import { creerImageSecours, lireToutesLesVilles, trouverVilleParNom } from "../services/voyage.js";

export default function Accueil() {
  const navigate = useNavigate();
  const utilisateurConnecte = lireUtilisateurConnecte();
  const villes = lireToutesLesVilles();
  const [historiqueRecherche, definirHistoriqueRecherche] = useState(() => lireHistoriqueRecherche());
  const [nomVille, definirNomVille] = useState("");
  const [nombreDeNuits, definirNombreDeNuits] = useState(2);
  const [nombreDePersonnes, definirNombreDePersonnes] = useState(2);
  const [messageErreur, definirMessageErreur] = useState("");

  useEffect(() => {
    function rafraichirHistorique() {
      definirHistoriqueRecherche(lireHistoriqueRecherche());
    }

    window.addEventListener(evenementsPlanMyTrip.historique, rafraichirHistorique);
    return () => window.removeEventListener(evenementsPlanMyTrip.historique, rafraichirHistorique);
  }, []);

  const villesVedettes = useMemo(() => villes.slice(0, 3), [villes]);
  const activitesVedettes = useMemo(
    () => villes.flatMap((ville) => ville.activites || []).slice(0, 4),
    [villes]
  );

  function enregistrerRechercheEtNaviguer(rechercheVoyage) {
    sauvegarderRechercheVoyage(rechercheVoyage);
    ajouterRechercheHistorique(rechercheVoyage);

    const resumeActuel = lireResumeVoyage();
    sauvegarderResumeVoyage({
      ...resumeActuel,
      villeNom: rechercheVoyage.nomVille,
      nombreDeNuits: rechercheVoyage.nombreDeNuits,
      nombreDePersonnes: rechercheVoyage.nombreDePersonnes,
    });

    navigate(`/ville/${encodeURIComponent(rechercheVoyage.nomVille)}/hebergements`);
  }

  function lancerRecherche(evenement) {
    evenement.preventDefault();
    definirMessageErreur("");

    const villeTrouvee = trouverVilleParNom(nomVille);

    if (!villeTrouvee) {
      definirMessageErreur("Cette ville n'est pas encore disponible dans les données du site.");
      return;
    }

    enregistrerRechercheEtNaviguer({
      nomVille: villeTrouvee.nom,
      nombreDeNuits: Number(nombreDeNuits) || 1,
      nombreDePersonnes: Number(nombreDePersonnes) || 1,
    });
  }

  return (
    <main className="page-accueil">
      <section className="hero-accueil">
        <div className="hero-accueil__texte">
          <p className="sur-ligne">PlanMyTrip · Travel experience</p>
          <p className="hero-accueil__bonjour">Bonjour {utilisateurConnecte?.prenom || "voyageur"}</p>
          <h1>Prépare un voyage élégant avec bannière immersive, filtres, wishlist, carte et résumé visible partout.</h1>
          <p>Le style vise une landing page moderne : grande bannière, cartes raffinées, navigation claire et expérience de réservation agréable.</p>

          <div className="hero-accueil__actions">
            <a className="bouton-primaire" href="#recherche-voyage">Commencer la recherche</a>
            <a className="bouton-secondaire" href="#historique-recherche">Voir l'historique</a>
          </div>

          <div className="hero-accueil__statistiques">
            <article><strong>4</strong><span>catégories</span></article>
            <article><strong>1</strong><span>wishlist fixe</span></article>
            <article><strong>100 %</strong><span>navigation par URL</span></article>
          </div>
        </div>

        <div className="hero-accueil__visuel">
          <div className="hero-accueil__banniere">
            <img src="/images/banniere.jpg" alt="Illustration de voyage" />
            <div className="hero-accueil__badge">Escapades premium</div>
            <div className="hero-accueil__carte-info">
              <strong>Design libre inspiré d'une landing page voyage</strong>
              <span>Navigation simple, image de bannière et ambiance plus haut de gamme.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-contenu section-contenu--compact" id="recherche-voyage">
        <form className="carte-recherche-principale carte-recherche-principale--horizontale" onSubmit={lancerRecherche}>
          <div className="bloc-recherche-titre">
            <p className="sur-ligne">Recherche</p>
            <h2>Saisis le nom d'une ville puis clique sur rechercher</h2>
          </div>

          <label className="champ-formulaire">
            <span>Ville de destination</span>
            <input
              type="text"
              value={nomVille}
              onChange={(evenement) => definirNomVille(evenement.target.value)}
              placeholder="Exemple : Matane ou Rimouski"
            />
          </label>

          <label className="champ-formulaire">
            <span>Nombre de nuits</span>
            <input type="number" min="1" value={nombreDeNuits} onChange={(evenement) => definirNombreDeNuits(evenement.target.value)} />
          </label>

          <label className="champ-formulaire">
            <span>Nombre de personnes</span>
            <input type="number" min="1" value={nombreDePersonnes} onChange={(evenement) => definirNombreDePersonnes(evenement.target.value)} />
          </label>

          <button type="submit" className="bouton-primaire bouton-recherche-principale">Rechercher</button>
          {messageErreur ? <p className="message-erreur message-erreur-recherche">{messageErreur}</p> : null}
        </form>
      </section>

      <section className="section-contenu" id="historique-recherche">
        <div className="entete-section">
          <div>
            <p className="sur-ligne">Historique</p>
            <h2>Recherches récentes</h2>
          </div>
        </div>

        <div className="historique-recherche">
          {historiqueRecherche.length === 0 ? (
            <article className="carte-vide">
              <h2>Aucune recherche enregistrée</h2>
              <p>Ton historique apparaîtra ici après la première recherche.</p>
            </article>
          ) : (
            historiqueRecherche.map((recherche, index) => (
              <button
                key={`${recherche.nomVille}-${index}`}
                type="button"
                className="pastille-historique"
                onClick={() => enregistrerRechercheEtNaviguer(recherche)}
              >
                {recherche.nomVille} · {recherche.nombreDeNuits} nuit(s) · {recherche.nombreDePersonnes} personne(s)
              </button>
            ))
          )}
        </div>
      </section>

      <section className="section-contenu">
        <div className="entete-section">
          <div>
            <p className="sur-ligne">Destinations</p>
            <h2>Villes populaires</h2>
          </div>
        </div>

        <div className="grille-villes">
          {villesVedettes.map((ville) => (
            <article key={ville.id} className="carte-ville">
              <img src={ville.imageHero || creerImageSecours(ville.nom)} alt={ville.nom} />
              <div className="carte-ville__contenu">
                <h3>{ville.nom}</h3>
                <p>{ville.description}</p>
                <button
                  type="button"
                  className="bouton-secondaire"
                  onClick={() => enregistrerRechercheEtNaviguer({ nomVille: ville.nom, nombreDeNuits: 2, nombreDePersonnes: 2 })}
                >
                  Explorer cette ville
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-contenu">
        <div className="entete-section">
          <div>
            <p className="sur-ligne">Inspirations</p>
            <h2>Activités à découvrir</h2>
          </div>
        </div>

        <div className="grille-cartes-simples">
          {activitesVedettes.map((activite) => (
            <article key={activite.id} className="carte-simple">
              <img src={activite.image || creerImageSecours(activite.nom)} alt={activite.nom} />
              <div className="carte-simple__contenu">
                <h3>{activite.nom}</h3>
                <p>{activite.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
