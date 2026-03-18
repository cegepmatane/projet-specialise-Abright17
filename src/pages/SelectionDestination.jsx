import { useEffect, useMemo, useState } from "react";
import donnees from "../data/data.json";
import "./SelectionDestination.css";

export default function SelectionDestination({
  recherche,
  surRetourAccueil,
  surVoirRecapitulatif,
}) {
  const [ongletActuel, definirOngletActuel] = useState("hebergements");

  const [identifiantHebergementSelectionne, definirHebergementSelectionne] =
    useState(() => {
      try {
        return JSON.parse(localStorage.getItem("planmytrip_hebergement")) || null;
      } catch {
        return null;
      }
    });

  const [identifiantTransportSelectionne, definirTransportSelectionne] =
    useState(() => {
      try {
        return JSON.parse(localStorage.getItem("planmytrip_transport")) || null;
      } catch {
        return null;
      }
    });

  const [identifiantsActivitesSelectionnees, definirActivitesSelectionnees] =
    useState(() => {
      try {
        return JSON.parse(localStorage.getItem("planmytrip_activites")) || [];
      } catch {
        return [];
      }
    });

  const villeSelectionnee = useMemo(() => {
    const destinationRecherchee = String(recherche?.destination || "")
      .trim()
      .toLowerCase();

    if (!destinationRecherchee) return null;

    const listeDesVilles = Array.isArray(donnees?.villes) ? donnees.villes : [];

    return (
      listeDesVilles.find(
        (ville) => String(ville?.nom || "").toLowerCase() === destinationRecherchee
      ) ||
      listeDesVilles.find(
        (ville) =>
          String(ville?.nom || "").toLowerCase().includes(destinationRecherchee)
      ) ||
      null
    );
  }, [recherche]);

  const listeHebergementsTries = useMemo(() => {
    const listeHebergements = Array.isArray(villeSelectionnee?.hebergements)
      ? villeSelectionnee.hebergements
      : [];

    return [...listeHebergements].sort(
      (hebergementA, hebergementB) =>
        (hebergementA.prix ?? 0) - (hebergementB.prix ?? 0)
    );
  }, [villeSelectionnee]);

  const listeActivitesDisponibles = useMemo(() => {
    return Array.isArray(villeSelectionnee?.activites)
      ? villeSelectionnee.activites
      : [];
  }, [villeSelectionnee]);

  const listeTransportsDisponibles = useMemo(() => {
    return Array.isArray(villeSelectionnee?.transports)
      ? villeSelectionnee.transports
      : [];
  }, [villeSelectionnee]);

  const nombreDePersonnes = Number(recherche?.nbPersonnes) || 1;
  const nombreDeNuits = Number(recherche?.nbNuits) || 1;

  useEffect(() => {
    localStorage.setItem(
      "planmytrip_hebergement",
      JSON.stringify(identifiantHebergementSelectionne)
    );
  }, [identifiantHebergementSelectionne]);

  useEffect(() => {
    localStorage.setItem(
      "planmytrip_transport",
      JSON.stringify(identifiantTransportSelectionne)
    );
  }, [identifiantTransportSelectionne]);

  useEffect(() => {
    localStorage.setItem(
      "planmytrip_activites",
      JSON.stringify(identifiantsActivitesSelectionnees)
    );
  }, [identifiantsActivitesSelectionnees]);

  useEffect(() => {
    if (!villeSelectionnee) return;

    const hebergementExisteEncore = listeHebergementsTries.some(
      (hebergement) => hebergement.id === identifiantHebergementSelectionne
    );

    if (!hebergementExisteEncore && identifiantHebergementSelectionne !== null) {
      definirHebergementSelectionne(null);
    }

    const transportExisteEncore = listeTransportsDisponibles.some(
      (transport) => transport.id === identifiantTransportSelectionne
    );

    if (!transportExisteEncore && identifiantTransportSelectionne !== null) {
      definirTransportSelectionne(null);
    }

    const activitesEncoreValides = identifiantsActivitesSelectionnees.filter(
      (identifiantActivite) =>
        listeActivitesDisponibles.some(
          (activite) => activite.id === identifiantActivite
        )
    );

    if (
      activitesEncoreValides.length !== identifiantsActivitesSelectionnees.length
    ) {
      definirActivitesSelectionnees(activitesEncoreValides);
    }
  }, [
    villeSelectionnee,
    listeHebergementsTries,
    listeTransportsDisponibles,
    listeActivitesDisponibles,
    identifiantHebergementSelectionne,
    identifiantTransportSelectionne,
    identifiantsActivitesSelectionnees,
  ]);

  function basculerSelectionActivite(identifiantActivite) {
    definirActivitesSelectionnees((ancienneListeActivites) => {
      if (ancienneListeActivites.includes(identifiantActivite)) {
        return ancienneListeActivites.filter(
          (identifiant) => identifiant !== identifiantActivite
        );
      }

      return [...ancienneListeActivites, identifiantActivite];
    });
  }

  function calculerTotalActuel() {
    let montantTotal = 0;

    const hebergementChoisi = listeHebergementsTries.find(
      (hebergement) => hebergement.id === identifiantHebergementSelectionne
    );

    if (hebergementChoisi) {
      montantTotal += (Number(hebergementChoisi.prix) || 0) * nombreDeNuits;
    }

    const transportChoisi = listeTransportsDisponibles.find(
      (transport) => transport.id === identifiantTransportSelectionne
    );

    if (transportChoisi) {
      montantTotal += Number(transportChoisi.prix) || 0;
    }

    for (const identifiantActivite of identifiantsActivitesSelectionnees) {
      const activiteChoisie = listeActivitesDisponibles.find(
        (activite) => activite.id === identifiantActivite
      );

      if (activiteChoisie) {
        montantTotal += (Number(activiteChoisie.prix) || 0) * nombreDePersonnes;
      }
    }

    return Math.round(montantTotal * 100) / 100;
  }

  function ouvrirPageRecapitulatif() {
    if (!villeSelectionnee) return;

    const nouvelleSelection = {
      villeNom: villeSelectionnee.nom,
      nbPersonnes: nombreDePersonnes,
      nbNuits: nombreDeNuits,
      hebergementId: identifiantHebergementSelectionne,
      transportId: identifiantTransportSelectionne,
      activitesIds: identifiantsActivitesSelectionnees,
    };

    localStorage.setItem("planmytrip_selection", JSON.stringify(nouvelleSelection));

    surVoirRecapitulatif?.(nouvelleSelection);
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

  if (!villeSelectionnee) {
    return (
      <div className="page-selection">
        <div className="conteneur">
          <h2>Ville introuvable</h2>
          <p>
            Destination : <b>{recherche.destination}</b>
          </p>
          <p>
            Vérifie que ta ville existe dans <code>data.json</code>.
          </p>
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
            Destination : <b>{villeSelectionnee.nom}</b> • {nombreDePersonnes} personne(s) •{" "}
            {nombreDeNuits} nuit(s)
          </div>
        </div>

        <div className="actions-barre">
          <button className="btn btn-secondaire" onClick={surRetourAccueil}>
            Retour
          </button>
          <button className="btn btn-primaire" onClick={ouvrirPageRecapitulatif}>
            Voir le récap • {calculerTotalActuel()} $
          </button>
        </div>
      </header>

      <section className="onglets-activite">
        <button
          className={`onglet ${ongletActuel === "hebergements" ? "actif" : ""}`}
          onClick={() => definirOngletActuel("hebergements")}
          type="button"
        >
          Hébergements
        </button>

        <button
          className={`onglet ${ongletActuel === "activites" ? "actif" : ""}`}
          onClick={() => definirOngletActuel("activites")}
          type="button"
        >
          Activités
        </button>

        <button
          className={`onglet ${ongletActuel === "transports" ? "actif" : ""}`}
          onClick={() => definirOngletActuel("transports")}
          type="button"
        >
          Transports
        </button>
      </section>

      <main className="conteneur">
        {ongletActuel === "hebergements" && (
          <>
            <h2>Hébergements ({nombreDeNuits} nuit(s))</h2>
            <div className="grille-cartes">
              {listeHebergementsTries.map((hebergement) => {
                const hebergementEstSelectionne =
                  identifiantHebergementSelectionne === hebergement.id;

                return (
                  <article key={hebergement.id} className="carte-element">
                    {hebergement.image && (
                      <img
                        className="image-element"
                        src={hebergement.image}
                        alt={hebergement.nom}
                      />
                    )}

                    <div className="contenu-carte">
                      <div className="ligne-top">
                        <div className="nom">{hebergement.nom}</div>
                        <div className="prix">{hebergement.prix} $ / nuit</div>
                      </div>

                      <div className="meta">
                        {hebergement.categorie} • Total hôtel :{" "}
                        {(Number(hebergement.prix) || 0) * nombreDeNuits} $
                      </div>

                      <div className="actions">
                        {!hebergementEstSelectionne ? (
                          <button
                            className="btn btn-primaire"
                            onClick={() =>
                              definirHebergementSelectionne(hebergement.id)
                            }
                            type="button"
                          >
                            Ajouter
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger"
                            onClick={() => definirHebergementSelectionne(null)}
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

        {ongletActuel === "activites" && (
          <>
            <h2>Activités (prix x {nombreDePersonnes} personne(s))</h2>
            <div className="grille-cartes">
              {listeActivitesDisponibles.map((activite) => {
                const activiteEstSelectionnee =
                  identifiantsActivitesSelectionnees.includes(activite.id);

                return (
                  <article key={activite.id} className="carte-element">
                    {activite.image && (
                      <img
                        className="image-element"
                        src={activite.image}
                        alt={activite.nom}
                      />
                    )}

                    <div className="contenu-carte">
                      <div className="ligne-top">
                        <div className="nom">{activite.nom}</div>
                        <div className="prix">{activite.prix} $</div>
                      </div>
                      <div className="meta">{activite.categorie}</div>

                      <div className="actions">
                        {!activiteEstSelectionnee ? (
                          <button
                            className="btn btn-primaire"
                            onClick={() => basculerSelectionActivite(activite.id)}
                            type="button"
                          >
                            Ajouter
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger"
                            onClick={() => basculerSelectionActivite(activite.id)}
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

        {ongletActuel === "transports" && (
          <>
            <h2>Transports</h2>
            <div className="grille-cartes">
              {listeTransportsDisponibles.map((transport) => {
                const transportEstSelectionne =
                  identifiantTransportSelectionne === transport.id;

                return (
                  <article key={transport.id} className="carte-element">
                    {transport.image && (
                      <img
                        className="image-element"
                        src={transport.image}
                        alt={transport.nom}
                      />
                    )}

                    <div className="contenu-carte">
                      <div className="ligne-top">
                        <div className="nom">{transport.nom}</div>
                        <div className="prix">{transport.prix} $</div>
                      </div>
                      <div className="meta">{transport.type}</div>

                      <div className="actions">
                        {!transportEstSelectionne ? (
                          <button
                            className="btn btn-primaire"
                            onClick={() =>
                              definirTransportSelectionne(transport.id)
                            }
                            type="button"
                          >
                            Ajouter
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger"
                            onClick={() => definirTransportSelectionne(null)}
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
