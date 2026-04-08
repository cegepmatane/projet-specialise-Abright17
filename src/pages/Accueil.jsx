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
      definirMessageErreur("Cette destination n'est pas encore répertoriée dans notre collection exclusive.");
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
          <p className="sur-ligne">PlanMyTrip · L'art de s'évader</p>
          <p className="hero-accueil__bonjour">Ravi de vous revoir, {utilisateurConnecte?.prenom || "voyageur"}</p>
          <h1>Concevez votre voyage sur mesure avec une élégance absolue.</h1>
          <p>Explorez des destinations d'exception, sélectionnez vos expériences et centralisez votre itinéraire en un seul lieu pour un séjour inoubliable.</p>

          <div className="hero-accueil__actions">
            <a className="bouton-primaire" href="#recherche-voyage">Explorer nos destinations</a>
            <a className="bouton-secondaire" href="#historique-recherche">Vos dernières inspirations</a>
          </div>

          <div className="hero-accueil__statistiques">
            <article><strong>Collections</strong><span>Curatées</span></article>
            <article><strong>Privilège</strong><span>Accompagnement</span></article>
            <article><strong>Sérénité</strong><span>100% Sécurisé</span></article>
          </div>
        </div>

        <div className="hero-accueil__visuel">
          <div className="hero-accueil__banniere">
            <img src="/images/banniere.jpg" alt="Voyage de luxe et sérénité" />
            <div className="hero-accueil__badge">Sélection Premium</div>
            <div className="hero-accueil__carte-info">
              <strong>Une expertise dédiée à vos projets</strong>
              <span>Une interface intuitive pour une planification sans compromis sur le style.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-contenu section-contenu--compact" id="recherche-voyage">
        <form className="carte-recherche-principale carte-recherche-principale--horizontale" onSubmit={lancerRecherche}>
          <div className="bloc-recherche-titre">
            <p className="sur-ligne">Planification</p>
            <h2>Où commence votre prochaine histoire ?</h2>
          </div>

          <label className="champ-formulaire">
            <span>Destination de rêve</span>
            <input
              type="text"
              value={nomVille}
              onChange={(evenement) => definirNomVille(evenement.target.value)}
              placeholder="Entrez une ville (ex: Matane, Rimouski...)"
            />
          </label>

          <label className="champ-formulaire">
            <span>Durée du séjour (nuits)</span>
            <input type="number" min="1" value={nombreDeNuits} onChange={(evenement) => definirNombreDeNuits(evenement.target.value)} />
          </label>

          <label className="champ-formulaire">
            <span>Nombre de voyageurs</span>
            <input type="number" min="1" value={nombreDePersonnes} onChange={(evenement) => definirNombreDePersonnes(evenement.target.value)} />
          </label>

          <button type="submit" className="bouton-primaire bouton-recherche-principale">Rechercher l'évasion</button>
          {messageErreur ? <p className="message-erreur message-erreur-recherche">{messageErreur}</p> : null}
        </form>
      </section>

      <section className="section-contenu" id="historique-recherche">
        <div className="entete-section">
          <div>
            <p className="sur-ligne">Continuité</p>
            <h2>Reprenez là où vous vous étiez arrêté</h2>
          </div>
        </div>

        <div className="historique-recherche">
          {historiqueRecherche.length === 0 ? (
            <article className="carte-vide">
              <h2>Votre carnet est encore vierge</h2>
              <p>Vos projets de voyage s'afficheront ici dès votre première recherche.</p>
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
            <h2>Vivez des expériences uniques</h2>
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
