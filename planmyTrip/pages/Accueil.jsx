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
      definirMessageErreur("Cette destination n'est pas encore répertoriée dans notre collection.");
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
          <p className="sur-ligne">PlanMyTrip · L'expertise du voyage</p>
          <p className="hero-accueil__bonjour">Ravi de vous revoir, {utilisateurConnecte?.prenom || "voyageur"}</p>
          <h1>Partez à la découverte de destinations qui font rêver et composez le voyage qui vous ressemble vraiment.</h1>
          <p>Explorez des destinations uniques et composez votre itinéraire idéal. De la sélection de votre résidence à vos expériences exclusives, nous organisons chaque détail pour un voyage inoubliable.</p>

          <div className="hero-accueil__actions">
            <a className="bouton-primaire" href="#recherche-voyage">Planifier un voyage</a>
            <a className="bouton-secondaire" href="#historique-recherche">Vos inspirations récentes</a>
          </div>

          <div className="hero-accueil__statistiques">
            <article><strong>Services</strong><span>Sur mesure</span></article>
            <article><strong>Sécurisé</strong><span>Paiements SSL</span></article>
            <article><strong>24/7</strong><span>Accompagnement</span></article>
          </div>
        </div>

        <div className="hero-accueil__visuel">
          <div className="hero-accueil__banniere">
            <img src="/images/banniere.jpg" alt="Expérience de voyage premium" />
            <div className="hero-accueil__badge">Sélection Premium</div>
            <div className="hero-accueil__carte-info">
              <strong>Une interface pensée pour l'excellence</strong>
              <span>Gestion intuitive de vos réservations, suivi budgétaire en temps réel et itinéraire centralisé.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-contenu section-contenu--compact" id="recherche-voyage">
        <form className="carte-recherche-principale carte-recherche-principale--horizontale" onSubmit={lancerRecherche}>
          <div className="bloc-recherche-titre">
            <p className="sur-ligne">Conciergerie</p>
            <h2>Où souhaitez-vous poser vos valises ?</h2>
          </div>

          <label className="champ-formulaire">
            <span>Ville de destination</span>
            <input
              type="text"
              value={nomVille}
              onChange={(evenement) => definirNomVille(evenement.target.value)}
              placeholder="Ex : Rimouski, Matane, Paris..."
            />
          </label>

          <label className="champ-formulaire">
            <span>Durée (nuits)</span>
            <input type="number" min="1" value={nombreDeNuits} onChange={(evenement) => definirNombreDeNuits(evenement.target.value)} />
          </label>

          <label className="champ-formulaire">
            <span>Voyageurs</span>
            <input type="number" min="1" value={nombreDePersonnes} onChange={(evenement) => definirNombreDePersonnes(evenement.target.value)} />
          </label>

          <button type="submit" className="bouton-primaire bouton-recherche-principale">Rechercher</button>
          {messageErreur ? <p className="message-erreur message-erreur-recherche">{messageErreur}</p> : null}
        </form>
      </section>

      <section className="section-contenu" id="historique-recherche">
        <div className="entete-section">
          <div>
            <p className="sur-ligne">Continuité</p>
            <h2>Reprenez vos projets en cours</h2>
          </div>
        </div>

        <div className="historique-recherche">
          {historiqueRecherche.length === 0 ? (
            <article className="carte-vide">
              <h2>Aucun projet enregistré</h2>
              <p>Votre historique de planification apparaîtra ici après votre première recherche.</p>
            </article>
          ) : (
            historiqueRecherche.map((recherche, index) => (
              <button
                key={`${recherche.nomVille}-${index}`}
                type="button"
                className="pastille-historique"
                onClick={() => enregistrerRechercheEtNaviguer(recherche)}
              >
                {recherche.nomVille} · {recherche.nombreDeNuits} nuit(s) · {recherche.nombreDePersonnes} pers.
              </button>
            ))
          )}
        </div>
      </section>

      <section className="section-contenu">
        <div className="entete-section">
          <div>
            <p className="sur-ligne">Collection Exclusive</p>
            <h2>Nos escales incontournables</h2>
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
                  Découvrir l'expérience
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-contenu">
        <div className="entete-section">
          <div>
            <p className="sur-ligne">Moments d'exception</p>
            <h2>Expériences à vivre</h2>
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
