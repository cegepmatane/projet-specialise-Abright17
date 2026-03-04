import { useEffect, useMemo, useState } from "react";
import donnees from "../data/data.json";
import "./Home.css";

export default function Accueil({ utilisateur, surDeconnexion, surRecherche }) {
  const [destination, setDestination] = useState("");
  const [nbPersonnes, setNbPersonnes] = useState(
    utilisateur?.nbPersonnesParDefaut ?? 2
  );

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
          x.nbPersonnes === item.nbPersonnes
        )
    );
    const suivant = [item, ...nettoye].slice(0, 6);
    localStorage.setItem("planmytrip_historique", JSON.stringify(suivant));
    setHistorique(suivant);
  }

  //ACTIVITÉS RECOMMANDÉES
  const activitesRecommandees = useMemo(() => {
    const villes = Array.isArray(donnees?.villes) ? donnees.villes : [];
    const toutes = villes.flatMap((v) =>
      Array.isArray(v?.activites) ? v.activites : []
    );
    return toutes.slice(0, 6);
  }, []);

  // SUGGESTIONS DESTINATION
  const suggestionsDestination = useMemo(() => {
    const villes = Array.isArray(donnees?.villes) ? donnees.villes : [];
    return villes
      .map((v) => String(v?.nom || "").trim())
      .filter(Boolean)
      .slice(0, 8);
  }, []);

  function gererSoumission(e) {
    e.preventDefault();
    const destinationPropre = destination.trim();
    if (!destinationPropre) return;

    const recherche = {
      destination: destinationPropre,
      nbPersonnes: Number(nbPersonnes) || 1,
      date: new Date().toISOString(),
    };

    sauvegarderDansHistorique(recherche);
    surRecherche?.(recherche);
  }

  function appliquerHistorique(item) {
    setDestination(item.destination);
    setNbPersonnes(item.nbPersonnes);
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
            Entre une destination et le nombre de personnes. Ensuite tu pourras
            choisir ton hébergement.
          </p>

          {/* BARRE DE RECHERCHE */}
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
                    {h.destination} • {h.nbPersonnes} pers.
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
              <b>Recherche</b> (destination + personnes)
            </li>
            <li>
              <b>Hébergement</b> (choisir un hôtel)
            </li>
            <li>
              <b>Activités</b> (ajouter des lieux)
            </li>
            <li>
              <b>Carte</b> (itinéraire sur Leaflet)
            </li>
          </ol>
          <div className="astuce">
            Astuce : clique une recherche dans l’historique pour la réutiliser.
          </div>
        </aside>
      </section>

      <section className="section">
        <div className="entete-section">
          <h2 className="titre-section">Activités recommandées</h2>
          <p className="sous-titre-section">
            Suggestions de choses à faire sur place.
          </p>
        </div>

        <div className="grille">
          {activitesRecommandees.length === 0 ? (
            <div className="vide">
              Aucune activité trouvée dans <code>data.json</code> (clé{" "}
              <b>villes[].activites</b>).
            </div>
          ) : (
            activitesRecommandees.map((a) => (
              <article key={String(a.id)} className="carte">
                <div className="haut-carte">
                  <div className="pilule">{a.categorie ?? "Activité"}</div>
                  <div className="prix">
                    {typeof a.prix === "number" ? `${a.prix}$` : "—"}
                  </div>
                </div>

                <div className="titre-carte">{a.nom ?? "Sans nom"}</div>

                <div className="meta-carte">
                  {a.lat && a.lng ? `📍 ${a.lat}, ${a.lng}` : "📍 Destination"}
                </div>

                {a.image && (
                  <img
                    src={a.image}
                    alt={a.nom ?? "Activité"}
                    className="image-carte"
                  />
                )}
              </article>
            ))
          )}
        </div>
      </section>

      {/* DONNÉES JSON */}
      <section className="section">
        <div className="entete-section">
          <h2 className="titre-section">Données chargées (data.json)</h2>
          <p className="sous-titre-section">
            Aperçu des villes et des lieux disponibles (restaurants, hébergements,
            activités).
          </p>
        </div>

        <div className="grille">
          {(donnees?.villes || []).map((ville) => (
            <article key={ville.nom} className="carte">
              <div className="titre-carte">{ville.nom}</div>

              <div className="meta-carte">
                  Restaurants : {(ville.restaurants || []).length}
                <br />
                  Hébergements : {(ville.hebergements || []).length}
                <br />
                  Activités : {(ville.activites || []).length}
              </div>
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
            <div className="icone"></div>
            <div className="titre">Itinéraire</div>
            <div className="texte">
              Visualise ton trajet sur la carte avec les lieux choisis.
            </div>
          </div>

          <div className="carte">
            <div className="icone"></div>
            <div className="titre">Carte interactive</div>
            <div className="texte">
              Marqueurs, infos, et affichage clair des endroits.
            </div>
          </div>

          <div className="carte">
            <div className="icone"></div>
            <div className="titre">Simple</div>
            <div className="texte">
              Tu avances : 1-recherche 2-hôtel 3-activités 4-carte.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
