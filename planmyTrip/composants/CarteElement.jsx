import { Link, useLocation } from "react-router";
import { creerImageSecours, formaterPrix } from "../services/voyage.js";

export default function CarteElement({ nomVille, categorie, element }) {
  const location = useLocation();

  return (
    <article className="carte-element-voyage">
      <img
        className="carte-element-voyage__image"
        src={element.image || creerImageSecours(element.nom)}
        alt={element.nom}
      />

      <div className="carte-element-voyage__contenu">
        <div className="carte-element-voyage__ligne">
          <h3>{element.nom}</h3>
          <strong>{formaterPrix(element.prix)}</strong>
        </div>

        <p className="carte-element-voyage__categorie">
          {element.categorie || element.type || "Découverte"}
        </p>

        <p className="carte-element-voyage__description">
          {element.description || "Un excellent choix pour enrichir ton séjour."}
        </p>

        <Link
          className="bouton-primaire"
          to={`/ville/${encodeURIComponent(nomVille)}/${categorie}/${element.id}`}
          state={{ depuis: location.pathname }}
        >
          Voir les détails
        </Link>
      </div>
    </article>
  );
}
