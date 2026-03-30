import { useEffect, useMemo, useState } from "react";
import donnees from "../data/data.json";
import CarteSelection from "../pages/CarteSelection";
import "./Home.css";

export default function Accueil({ utilisateur, surDeconnexion, surRecherche }) {
  const [destination, setDestination] = useState("");
  const [nbPersonnes, setNbPersonnes] = useState(
    utilisateur?.nbPersonnesParDefaut ?? 2
  );
  const [nbNuits, setNbNuits] = useState(1);
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    const sauvegarde = JSON.parse(
      localStorage.getItem("planmytrip_historique") || "[]"
    );
    setHistorique(sauvegarde);
  }, []);

  function sauvegarderDansHistorique(item) {
    const sauvegarde = JSON.parse(
      localStorage.getItem("planmytrip_historique") || "[]"
    );

    const nettoye = sauvegarde.filter(
      (x) =>
        !(
          x.destination === item.destination &&
          x.nbPersonnes === item.nbPersonnes &&
          x.nbNuits === item.nbNuits
        )
    );

    const suivant = [item, ...nettoye].slice(0, 6);
    localStorage.setItem("planmytrip_historique", JSON.stringify(suivant));
    setHistorique(suivant);
  }

  const villes = useMemo(() => {
    return Array.isArray(donnees?.villes) ? donnees.villes : [];
  }, []);

  const suggestionsDestination = useMemo(() => {
    return villes.map((v) => String(v?.nom || "").trim()).filter(Boolean);
  }, [villes]);

  const tousLesElements = useMemo(() => {
    const resultat = [];

    villes.forEach((ville) => {
      const hebergements = Array.isArray(ville?.hebergements)
        ? ville.hebergements
        : [];
      const activites = Array.isArray(ville?.activites) ? ville.activites : [];
      const transports = Array.isArray(ville?.transports)
        ? ville.transports
        : [];
      const restaurants = Array.isArray(ville?.restaurants)
        ? ville.restaurants
        : [];

      hebergements.forEach((item) =>
        resultat.push({
          ...item,
          typeAffichage: "Hébergement",
          villeNom: ville.nom,
        })
      );

      activites.forEach((item) =>
        resultat.push({
          ...item,
          typeAffichage: "Activité",
          villeNom: ville.nom,
        })
      );

      transports.forEach((item) =>
        resultat.push({
          ...item,
          typeAffichage: "Transport",
          villeNom: ville.nom,
        })
      );

      restaurants.forEach((item) =>
        resultat.push({
          ...item,
          typeAffichage: "Restaurant",
          villeNom: ville.nom,
        })
      );
    });

    return resultat;
  }, [villes]);

  function gererSoumission(e) {
    e.preventDefault();

    const destinationPropre = destination.trim();
    if (!destinationPropre) return;

    const recherche = {
      destination: destinationPropre,
      nbPersonnes: Number(nbPersonnes) || 1,
      nbNuits: Number(nbNuits) || 1,
      date: new Date().toISOString(),
    };

    sauvegarderDansHistorique(recherche);
    surRecherche?.(recherche);
  }

  function appliquerHistorique(item) {
    setDestination(item.destination);
    setNbPersonnes(item.nbPersonnes);
    setNbNuits(item.nbNuits || 1);
  }

  function effacerHistorique() {
    localStorage.removeItem("planmytrip_historique");
    setHistorique([]);
  }

  return (
    <div className="accueil">
      <header className="barre-superieure">
        <div className="barre-gauche">
          <div className="marque">PlanMyTrip</div>
          <div className="bienvenue">
            Bienvenue{" "}
            <span className="nom-bienvenue">
              {utilisateur?.prenom} {utilisateur?.nom}
            </span>
          </div>
        </div>

        <button className="bouton-deconnexion" onClick={surDeconnexion}>
          Déconnexion
        </button>
      </header>

      <section className="zone-hero">
        <div className="contenu-hero">
          <div className="etiquette">Prototype</div>

          <h1 className="titre-hero">
            Planifie ton voyage simplement.
            <span className="accent-titre-hero">
              {" "}
              Hébergement, activités, itinéraire.
            </span>
          </h1>

          <p className="sous-titre-hero">
            Entre une destination, le nombre de personnes et le nombre de nuits.
          </p>

          <form className="barre-recherche" onSubmit={gererSoumission}>
            <div className="champ">
              <label className="label-champ">Destination</label>
              <input
                className="input-champ"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ex: Matane, Rimouski..."
                list="destinations"
                required
              />
              <datalist id="destinations">
                {suggestionsDestination.map((nomVille) => (
                  <option key={nomVille} value={nomVille} />
                ))}
              </datalist>
            </div>

            <div className="champ champ-petit">
              <label className="label-champ">Personnes</label>
              <input
                className="input-champ"
                type="number"
                min="1"
                max="12"
                value={nbPersonnes}
                onChange={(e) => setNbPersonnes(e.target.value)}
                required
              />
            </div>

            <div className="champ champ-petit">
              <label className="label-champ">Nuits</label>
              <input
                className="input-champ"
                type="number"
                min="1"
                max="30"
                value={nbNuits}
                onChange={(e) => setNbNuits(e.target.value)}
                required
              />
            </div>

            <button className="bouton-recherche" type="submit">
              Rechercher
            </button>
          </form>

          <div className="historique">
            <div className="ligne-historique">
              <div className="titre-historique">Historique des recherches</div>

              {historique.length > 0 && (
                <button
                  type="button"
                  className="nettoyer-historique"
                  onClick={effacerHistorique}
                >
                  Effacer
                </button>
              )}
            </div>

            {historique.length === 0 ? (
              <div className="historique-vide">
                Aucune recherche pour le moment.
              </div>
            ) : (
              <div className="jetons-historique">
                {historique.map((h, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="jeton"
                    onClick={() => appliquerHistorique(h)}
                    title="Cliquer pour réutiliser"
                  >
                    {h.destination} • {h.nbPersonnes} pers. • {h.nbNuits} nuit(s)
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="cote-hero">
          <div className="titre-cote">Étapes du voyage</div>
          <ol className="etapes">
            <li>
              <b>Recherche</b>
            </li>
            <li>
              <b>Hébergement</b>
            </li>
            <li>
              <b>Activités</b>
            </li>
            <li>
              <b>Transport</b>
            </li>
            <li>
              <b>Carte</b>
            </li>
          </ol>
          <div className="astuce">
            Astuce : clique une recherche dans l’historique pour la réutiliser.
          </div>
        </aside>
      </section>

      <section className="section">
        <div className="entete-section">
          <h2 className="titre-section">Explorer la carte</h2>
          <p className="sous-titre-section">
            Visualise les lieux populaires.
          </p>
        </div>

        <CarteSelection villes={villes} />
      </section>

      <section className="section">
        <div className="entete-section">
          <h2 className="titre-section">Tous les éléments disponibles</h2>
          <p className="sous-titre-section">
            Tous les hébergements, activités, transports et restaurants.
          </p>
        </div>

        <div className="grille">
          {tousLesElements.slice(0, 6).map((element, index) => (
            <article
              key={element.id || `${element.nom}-${index}`}
              className="carte"
            >
              <div className="haut-carte">
                <div className="pilule">{element.typeAffichage}</div>
                <div className="prix">
                  {typeof element.prix === "number"
                    ? `${element.prix}$`
                    : "—"}
                </div>
              </div>

              <div className="titre-carte">{element.nom}</div>

              {element.image ? (
                <img
                  src={element.image}
                  className="image-carte"
                  alt=""
                />
              ) : (
                <div className="image-carte image-placeholder">
                  Image non disponible
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="entete-section">
          <h2 className="titre-section">Pourquoi PlanMyTrip ?</h2>
          <p className="sous-titre-section">
            Un planning de voyage clair, étape par étape.
          </p>
        </div>

        <div className="grille">
          <div className="carte">
            <div className="titre">Itinéraire</div>
            <div className="texte">
              Visualise ton trajet sur la carte avec les lieux choisis.
            </div>
          </div>

          <div className="carte">
            <div className="titre">Carte interactive</div>
            <div className="texte">
              Marqueurs, infos, et affichage clair des endroits.
            </div>
          </div>

          <div className="carte">
            <div className="titre">Simple</div>
            <div className="texte">
              Tu avances : 1-recherche 2-hôtel 3-activités 4-transport 5-carte.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
