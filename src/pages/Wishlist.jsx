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

      </div>
    </main>
  );
}
