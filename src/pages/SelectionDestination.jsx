import { useMemo, useState } from "react";
import donnees from "../data/data.json";
import "./SelectionDestination.css";

export default function SelectionDestination({
  recherche,
  surRetourAccueil,
}) {
  const [ongletActif, setOngletActif] = useState("hebergements");

  // Sélections
  const [hebergementId, setHebergementId] = useState(null);
  const [transportId, setTransportId] = useState(null);
  const [activitesIds, setActivitesIds] = useState([]);

  const ville = useMemo(() => {
    const destination = String(recherche?.destination || "").trim().toLowerCase();
    if (!destination) return null;

    const villes = Array.isArray(donnees?.villes) ? donnees.villes : [];
    return (
      villes.find((v) => String(v?.nom || "").toLowerCase() === destination) ||
      villes.find((v) => String(v?.nom || "").toLowerCase().includes(destination)) ||
      null
    );
  }, [recherche]);

  const hebergementsTries = useMemo(() => {
    const liste = Array.isArray(ville?.hebergements) ? ville.hebergements : [];
    return [...liste].sort((a, b) => (a.prix ?? 0) - (b.prix ?? 0));
  }, [ville]);

  const activites = useMemo(() => {
    return Array.isArray(ville?.activites) ? ville.activites : [];
  }, [ville]);

  const transports = useMemo(() => {
    return Array.isArray(ville?.transports) ? ville.transports : [];
  }, [ville]);

  const nbPersonnes = Number(recherche?.nbPersonnes) || 1;

  function basculerActivite(id) {
    setActivitesIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }

  function totalActuel() {
    let total = 0;

    const h = hebergementsTries.find((x) => x.id === hebergementId);
    if (h) total += Number(h.prix) || 0;

    const t = transports.find((x) => x.id === transportId);
    if (t) total += Number(t.prix) || 0;

    for (const id of activitesIds) {
      const a = activites.find((x) => x.id === id);
      if (a) total += (Number(a.prix) || 0) * nbPersonnes;
    }

    return Math.round(total * 100) / 100;
  }


  if (!recherche?.destination) {
    return (
      <div className="page-selection">
        <div className="conteneur">
          <h2>Oups… aucune recherche</h2>
          <button className="btn btn-secondaire" onClick={surRetourAccueil}>
            Retour à l’accueil
          </button>
        </div>
      </div>
    );
  }

  if (!ville) {
    return (
      <div className="page-selection">
        <div className="conteneur">
          <h2>Ville introuvable</h2>
          <p>
            Destination : <b>{recherche.destination}</b>
          </p>
          <p>Vérifie que ta ville existe dans <code>data.json</code>.</p>
          <button className="btn btn-secondaire" onClick={surRetourAccueil}>
            Retour à l’accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-selection">
      <header className="barre-selection">
        <div>
          <div className="titre-barre">PlanMyTrip</div>
          <div className="sous-barre">
            Destination : <b>{ville.nom}</b> • {nbPersonnes} personne(s)
          </div>
        </div>

        <div className="actions-barre">
          <button className="btn btn-secondaire" onClick={surRetourAccueil}>
            Retour
          </button>
        </div>
      </header>

      {/* Onglets style Expedia */}
      <section className="onglets-expedia">
        <button
          className={`onglet ${ongletActif === "hebergements" ? "actif" : ""}`}
          onClick={() => setOngletActif("hebergements")}
          type="button"
        >
        Hébergements
        </button>

        <button
          className={`onglet ${ongletActif === "activites" ? "actif" : ""}`}
          onClick={() => setOngletActif("activites")}
          type="button"
        >
          Activités
        </button>

        <button
          className={`onglet ${ongletActif === "transports" ? "actif" : ""}`}
          onClick={() => setOngletActif("transports")}
          type="button"
        >
         Transports
        </button>
      </section>

      <main className="conteneur">
        {ongletActif === "hebergements" && (
          <>
            <h2>Hébergements (du moins cher au plus cher)</h2>
            <div className="grille-cartes">
              {hebergementsTries.map((h) => {
                const estChoisi = hebergementId === h.id;

                return (
                  <article key={h.id} className="carte-element">
                    <img className="image-element" src={h.image} alt={h.nom} />
                    <div className="contenu-carte">
                      <div className="ligne-top">
                        <div className="nom">{h.nom}</div>
                        <div className="prix">{h.prix} $</div>
                      </div>
                      <div className="meta">{h.categorie}</div>

                      <div className="actions">
                        {!estChoisi ? (
                          <button
                            className="btn btn-primaire"
                            onClick={() => setHebergementId(h.id)}
                            type="button"
                          >
                            Ajouter
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger"
                            onClick={() => setHebergementId(null)}
                            type="button"
                          >
                            Retirer
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {ongletActif === "activites" && (
          <>
            <h2>Activités (prix x {nbPersonnes} personne(s))</h2>
            <div className="grille-cartes">
              {activites.map((a) => {
                const estAjoutee = activitesIds.includes(a.id);

                return (
                  <article key={a.id} className="carte-element">
                    <img className="image-element" src={a.image} alt={a.nom} />
                    <div className="contenu-carte">
                      <div className="ligne-top">
                        <div className="nom">{a.nom}</div>
                        <div className="prix">{a.prix} $</div>
                      </div>
                      <div className="meta">{a.categorie}</div>

                      <div className="actions">
                        {!estAjoutee ? (
                          <button
                            className="btn btn-primaire"
                            onClick={() => basculerActivite(a.id)}
                            type="button"
                          >
                            Ajouter
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger"
                            onClick={() => basculerActivite(a.id)}
                            type="button"
                          >
                            Retirer
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {ongletActif === "transports" && (
          <>
            <h2>Transports</h2>
            <div className="grille-cartes">
              {transports.map((t) => {
                const estChoisi = transportId === t.id;

                return (
                  <article key={t.id} className="carte-element">
                    <img className="image-element" src={t.image} alt={t.nom} />
                    <div className="contenu-carte">
                      <div className="ligne-top">
                        <div className="nom">{t.nom}</div>
                        <div className="prix">{t.prix} $</div>
                      </div>
                      <div className="meta">{t.type}</div>

                      <div className="actions">
                        {!estChoisi ? (
                          <button
                            className="btn btn-primaire"
                            onClick={() => setTransportId(t.id)}
                            type="button"
                          >
                            Ajouter
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger"
                            onClick={() => setTransportId(null)}
                            type="button"
                          >
                            Retirer
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
