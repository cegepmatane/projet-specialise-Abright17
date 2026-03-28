import { useMemo, useState } from "react";
import { useParams } from "react-router";
import CarteElement from "../composants/CarteElement.jsx";
import FiltresElements from "../composants/FiltresElements.jsx";
import { lireRechercheVoyage } from "../services/stockageLocal.js";
import { lireElementsParCategorie, trouverVilleParNom } from "../services/voyage.js";

const TITRES_CATEGORIES = {
  hebergements: "Hébergements",
  activites: "Activités",
  restaurants: "Restaurants",
  transports: "Transports",
};

export default function ListeCategorie() {
  const { nomVille, categorie } = useParams();
  const ville = trouverVilleParNom(nomVille);
  const elements = lireElementsParCategorie(ville, categorie);
  const rechercheVoyage = lireRechercheVoyage();

  const [filtreTexte, definirFiltreTexte] = useState("");
  const [triActuel, definirTriActuel] = useState("pertinence");
  const [filtrePrixMaximum, definirFiltrePrixMaximum] = useState("");

  const elementsFiltres = useMemo(() => {
    const texteNormalise = filtreTexte.toLowerCase().trim();
    const prixMaximum = Number(filtrePrixMaximum);

    const resultat = elements.filter((element) => {
      const texteElement = `${element.nom} ${element.categorie || ""} ${element.type || ""}`.toLowerCase();
      const respecteTexte = !texteNormalise || texteElement.includes(texteNormalise);
      const respectePrix = !prixMaximum || Number(element.prix) <= prixMaximum;
      return respecteTexte && respectePrix;
    });

    if (triActuel === "prix-croissant") {
      return [...resultat].sort((elementA, elementB) => Number(elementA.prix) - Number(elementB.prix));
    }

    if (triActuel === "prix-decroissant") {
      return [...resultat].sort((elementA, elementB) => Number(elementB.prix) - Number(elementA.prix));
    }

  return (
    <main className="page-contenu">
      <section className="entete-page-categorie entete-page-categorie--banniere">
        <div>
          <p className="sur-ligne">{ville.nom}</p>
          <h1>{TITRES_CATEGORIES[categorie] || "Offres"}</h1>
          <p>{rechercheVoyage?.nombreDePersonnes || 1} personne(s) · {rechercheVoyage?.nombreDeNuits || 1} nuit(s)</p>
        </div>
      </section>

      <section className="mise-en-page-liste">
        <FiltresElements
          filtreTexte={filtreTexte}
          definirFiltreTexte={definirFiltreTexte}
          triActuel={triActuel}
          definirTriActuel={definirTriActuel}
          filtrePrixMaximum={filtrePrixMaximum}
          definirFiltrePrixMaximum={definirFiltrePrixMaximum}
        />

        <div className="grille-cartes-principales">
          {elementsFiltres.length === 0 ? (
            <article className="carte-vide">
              <h2>Aucun résultat</h2>
              <p>Modifie les filtres pour afficher plus d'options dans cette ville.</p>
            </article>
          ) : (
            elementsFiltres.map((element) => (
              <CarteElement key={element.id} nomVille={ville.nom} categorie={categorie} element={element} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
