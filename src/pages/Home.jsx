import { useState } from "react";
import "./Home.css";

export default function Accueil({ utilisateur, onDeconnexion, onRecherche }) {
  const [destination, setDestination] = useState("");
  const [nombrePersonnes, setNombrePersonnes] = useState(
    utilisateur?.nbPersonnesParDefaut ?? 2
  );

  function gererSoumission(event) {
    event.preventDefault();

    const destinationNettoyee = destination.trim();
    if (!destinationNettoyee) return;

    onRecherche?.({
      destination: destinationNettoyee,
      nombrePersonnes: Number(nombrePersonnes) || 1,
    });
  }

  return (
    <div className="page-accueil">

      <header className="barre-haut">
        <div>
          <div className="logo-site">PlanMyTrip</div>
          <div className="message-bienvenue">
            Bienvenue{" "}
            <span className="nom-utilisateur">
              {utilisateur?.prenom} {utilisateur?.nom}
            </span>
          </div>
        </div>

        <button className="bouton-deconnexion" onClick={onDeconnexion}>
          Déconnexion
        </button>
      </header>

      <section className="section-principale">
        <div className="conteneur-principal">

          <div className="etiquette-prototype">Prototype</div>

          <h1 className="titre-principal">
            Planifie ton voyage simplement.
            <span className="texte-accent">
              {" "}Hébergement, activités, itinéraire.
            </span>
          </h1>

          <p className="sous-titre">
            Entre une destination et le nombre de personnes pour commencer.
          </p>

          <form className="formulaire-recherche" onSubmit={gererSoumission}>

            <div className="champ-formulaire">
              <label className="etiquette-champ">Destination</label>
              <input
                className="input-champ"
                value={destination}
                onChange={(event) => setDestination(e.target.value)}
                placeholder="Ex: Matane, Paris, Montréal..."
                required
              />
            </div>

            <div className="champ-formulaire">
              <label className="etiquette-champ">Personnes</label>
              <input
                className="input-champ"
                type="number"
                min="1"
                max="12"
                value={nombrePersonnes}
                onChange={(event) => setNombrePersonnes(event.target.value)}
                required
              />
            </div>

            <button className="bouton-recherche" type="submit">
              Rechercher
            </button>

          </form>
        </div>
      </section>

    </div>
  );
}
