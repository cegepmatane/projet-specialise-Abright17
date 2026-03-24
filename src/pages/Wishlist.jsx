import { useEffect, useState } from "react";
import { Link } from "react-router";
import { evenementsPlanMyTrip, lireWishlist, sauvegarderWishlist } from "../services/stockageLocal.js";
import { creerImageSecours } from "../services/voyage.js";

export default function Wishlist() {
  const [wishlist, definirWishlist] = useState(() => lireWishlist());

  useEffect(() => {
    function rafraichirWishlist() {
      definirWishlist(lireWishlist());
    }

    window.addEventListener(evenementsPlanMyTrip.wishlist, rafraichirWishlist);
    return () => window.removeEventListener(evenementsPlanMyTrip.wishlist, rafraichirWishlist);
  }, []);

  function retirerElement(identifiantElement) {
    const wishlistMiseAJour = wishlist.filter((element) => element.id !== identifiantElement);
    sauvegarderWishlist(wishlistMiseAJour);
    definirWishlist(wishlistMiseAJour);
  }

  return (
    <main className="page-contenu">
      <section className="entete-page-categorie">
        <div>
          <p className="sur-ligne">Tes favoris</p>
          <h1>Wishlist</h1>
        </div>
      </section>

      <div className="grille-cartes-principales">
        {wishlist.length === 0 ? (
          <article className="carte-vide">
            <h2>Aucun favori pour le moment</h2>
            <p>Ajoute des hébergements, activités, restaurants ou transports à partir des pages détails.</p>
          </article>
        ) : (
          wishlist.map((element) => (
            <article key={element.id} className="carte-element-voyage">
              <img
                className="carte-element-voyage__image"
                src={element.image || creerImageSecours(element.nom)}
                alt={element.nom}
              />
              <div className="carte-element-voyage__contenu">
                <div className="carte-element-voyage__ligne">
                  <h3>{element.nom}</h3>
                  <strong>{element.prix} $</strong>
                </div>
                <p className="carte-element-voyage__categorie">{element.categorie || element.type || "Élément voyage"}</p>
                <p className="carte-element-voyage__description">{element.description}</p>
                <div className="groupe-boutons-actions groupe-boutons-actions--compact">
                  <Link
                    className="bouton-primaire"
                    to={`/ville/${encodeURIComponent(element.villeNom || "")}/${element.categorieRoute || "hebergements"}/${element.id}`}
                  >
                    Voir les détails
                  </Link>
                  <button type="button" className="bouton-secondaire" onClick={() => retirerElement(element.id)}>
                    Retirer
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
