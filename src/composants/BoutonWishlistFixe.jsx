import { useEffect, useState } from "react";
import { Link } from "react-router";
import { evenementsPlanMyTrip, lireWishlist } from "../services/stockageLocal.js";

export default function BoutonWishlistFixe() {
  const [wishlist, definirWishlist] = useState(() => lireWishlist());

  useEffect(() => {
    function rafraichirWishlist() {
      definirWishlist(lireWishlist());
    }

    window.addEventListener(evenementsPlanMyTrip.wishlist, rafraichirWishlist);
    return () => window.removeEventListener(evenementsPlanMyTrip.wishlist, rafraichirWishlist);
  }, []);

  return (
    <Link to="/wishlist" className="bouton-wishlist-fixe">
       Wishlist ({wishlist.length})
    </Link>
  );
}
