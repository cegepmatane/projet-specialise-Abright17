import { useMemo } from "react";
import donnees from "../data/data.json";
import "./Recapitulatif.css";

export default function Recapitulatif({
  selection,
  surRetourSelection,
  surRetourAccueil,
  surMettreAJourSelection,
}) {
  const ville = useMemo(() => {
    const villes = Array.isArray(donnees?.villes) ? donnees.villes : [];
    return villes.find((v) => v.nom === selection?.villeNom) || null;
  }, [selection]);

  const nbPersonnes = Number(selection?.nbPersonnes) || 1;

  const hebergement = useMemo(() => {
    const liste = Array.isArray(ville?.hebergements) ? ville.hebergements : [];
    return liste.find((x) => x.id === selection?.hebergementId) || null;
  }, [ville, selection]);

  const transport = useMemo(() => {
    const liste = Array.isArray(ville?.transports) ? ville.transports : [];
    return liste.find((x) => x.id === selection?.transportId) || null;
  }, [ville, selection]);

  const activitesChoisies = useMemo(() => {
    const liste = Array.isArray(ville?.activites) ? ville.activites : [];
    const ids = Array.isArray(selection?.activitesIds) ? selection.activitesIds : [];
    return ids.map((id) => liste.find((a) => a.id === id)).filter(Boolean);
  }, [ville, selection]);


  return (
    <div className="page-recap">
      <header className="barre-recap">
        <div>
          <div className="titre">Récapitulatif</div>
          <div className="sous">
            Ville : <b>{selection.villeNom}</b> • {nbPersonnes} personne(s)
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
         <section className="total">
          <div>Total</div>
          <div className="montant">{total} $</div>
        </section>
      </main>
    </div>
  );
}
