import { useMemo } from "react";
import donnees from "../data/data.json";
import "./Recapitulatif.css";

export default function Recapitulatif({
  selection,
  surRetourSelection,
  surRetourAccueil,
  surMettreAJourSelection,
}) {
  const villeSelectionnee = useMemo(() => {
    const listeVilles = Array.isArray(donnees?.villes) ? donnees.villes : [];
    return listeVilles.find((ville) => ville.nom === selection?.villeNom) || null;
  }, [selection]);

  const nombrePersonnes = Number(selection?.nbPersonnes) || 1;

  const hebergementSelectionne = useMemo(() => {
    const listeHebergements = Array.isArray(villeSelectionnee?.hebergements)
      ? villeSelectionnee.hebergements
      : [];
    return (
      listeHebergements.find(
        (hebergement) => hebergement.id === selection?.hebergementId
      ) || null
    );
  }, [villeSelectionnee, selection]);

  const transportSelectionne = useMemo(() => {
    const listeTransports = Array.isArray(villeSelectionnee?.transports)
      ? villeSelectionnee.transports
      : [];
    return (
      listeTransports.find(
        (transport) => transport.id === selection?.transportId
      ) || null
    );
  }, [villeSelectionnee, selection]);

  const activitesSelectionnees = useMemo(() => {
    const listeActivites = Array.isArray(villeSelectionnee?.activites)
      ? villeSelectionnee.activites
      : [];
    const listeIdsActivites = Array.isArray(selection?.activitesIds)
      ? selection.activitesIds
      : [];

    return listeIdsActivites
      .map((identifiantActivite) =>
        listeActivites.find(
          (activite) => activite.id === identifiantActivite
        )
      )
      .filter(Boolean);
  }, [villeSelectionnee, selection]);

  const prixTotal = useMemo(() => {
    let sommeTotale = 0;

    if (hebergementSelectionne) {
      sommeTotale += Number(hebergementSelectionne.prix) || 0;
    }

    if (transportSelectionne) {
      sommeTotale += Number(transportSelectionne.prix) || 0;
    }

    for (const activite of activitesSelectionnees) {
      sommeTotale += (Number(activite.prix) || 0) * nombrePersonnes;
    }

    return Math.round(sommeTotale * 100) / 100;
  }, [
    hebergementSelectionne,
    transportSelectionne,
    activitesSelectionnees,
    nombrePersonnes,
  ]);

  function retirerHebergement() {
    surMettreAJourSelection?.({
      ...selection,
      hebergementId: null,
    });
  }

  function retirerTransport() {
    surMettreAJourSelection?.({
      ...selection,
      transportId: null,
    });
  }

  function retirerActivite(identifiantActivite) {
    const listeIdsActivites = Array.isArray(selection?.activitesIds)
      ? selection.activitesIds
      : [];

    surMettreAJourSelection?.({
      ...selection,
      activitesIds: listeIdsActivites.filter(
        (identifiant) => identifiant !== identifiantActivite
      ),
    });
  }

  if (!selection?.villeNom) {
    return (
      <div className="page-recap">
        <div className="conteneur">
          <h2>Récapitulatif indisponible</h2>
          <button className="btn btn-secondaire" onClick={surRetourAccueil}>
            Retour accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-recap">
      <header className="barre-recap">
        <div>
          <div className="titre">Récapitulatif</div>
          <div className="sous">
            Ville : <b>{selection.villeNom}</b> • {nombrePersonnes} personne(s)
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-secondaire" onClick={surRetourSelection}>
            Retour sélection
          </button>
          <button className="btn btn-secondaire" onClick={surRetourAccueil}>
            Accueil
          </button>
        </div>
      </header>

      <main className="conteneur">
        <section className="bloc">
          <h3>Hébergement</h3>
          {!hebergementSelectionne ? (
            <p className="vide">Aucun hébergement sélectionné.</p>
          ) : (
            <div className="ligne">
              <div>
                <div className="nom">{hebergementSelectionne.nom}</div>
                <div className="meta">{hebergementSelectionne.categorie}</div>
              </div>
              <div className="droite">
                <div className="prix">{hebergementSelectionne.prix} $</div>
                <button className="btn btn-danger" onClick={retirerHebergement} type="button">
                  Retirer
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="bloc">
          <h3>Transports</h3>
          {!transportSelectionne ? (
            <p className="vide">Aucun transport sélectionné.</p>
          ) : (
            <div className="ligne">
              <div>
                <div className="nom">{transportSelectionne.nom}</div>
                <div className="meta">{transportSelectionne.type}</div>
              </div>
              <div className="droite">
                <div className="prix">{transportSelectionne.prix} $</div>
                <button className="btn btn-danger" onClick={retirerTransport} type="button">
                  Retirer
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="bloc">
          <h3>Activités</h3>
          {activitesSelectionnees.length === 0 ? (
            <p className="vide">Aucune activité sélectionnée.</p>
          ) : (
            activitesSelectionnees.map((activite) => (
              <div key={activite.id} className="ligne">
                <div>
                  <div className="nom">{activite.nom}</div>
                  <div className="meta">
                    {activite.categorie} • {activite.prix} $ x {nombrePersonnes}
                  </div>
                </div>
                <div className="droite">
                  <div className="prix">
                    {(Number(activite.prix) || 0) * nombrePersonnes} $
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => retirerActivite(activite.id)}
                    type="button"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="total">
          <div>Total</div>
          <div className="montant">{prixTotal} $</div>
        </section>
      </main>
    </div>
  );
}
