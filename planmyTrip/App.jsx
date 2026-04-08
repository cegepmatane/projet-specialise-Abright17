import { Navigate, Route, Routes } from "react-router";
import NavigationPrincipale from "./composants/NavigationPrincipale.jsx";
import BoutonWishlistFixe from "./composants/BoutonWishlistFixe.jsx";
import ResumeCompact from "./composants/ResumeCompact.jsx";
import RouteProtegee from "./composants/RouteProtegee.jsx";
import Accueil from "./pages/Accueil.jsx";
import DetailsElement from "./pages/DetailsElement.jsx";
import ListeCategorie from "./pages/ListeCategorie.jsx";
import Login from "./pages/Login.jsx";
import PageIntrouvable from "./pages/PageIntrouvable.jsx";
import ResumeVoyage from "./pages/ResumeVoyage.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import PageContact from "./pages/PageContact.jsx";
import PageMore from "./pages/PageMore.jsx";
import { lireUtilisateurConnecte } from "./services/stockageLocal.js";

export default function App() {
  const utilisateurConnecte = lireUtilisateurConnecte();

  return (
    <div className="application-planmytrip">
      {utilisateurConnecte ? (
        <>
          <NavigationPrincipale />
          <BoutonWishlistFixe />
          <ResumeCompact />
        </>
      ) : null}

      <Routes>
        <Route
          path="/login"
          element={utilisateurConnecte ? <Navigate to="/" replace /> : <Login />}
        />

        <Route path="/" element={<RouteProtegee><Accueil /></RouteProtegee>} />
        <Route path="/contact" element={<RouteProtegee><PageContact /></RouteProtegee>} />
        <Route path="/more" element={<RouteProtegee><PageMore /></RouteProtegee>} />
        <Route path="/ville/:nomVille/:categorie" element={<RouteProtegee><ListeCategorie /></RouteProtegee>} />
        <Route path="/ville/:nomVille/:categorie/:identifiantElement" element={<RouteProtegee><DetailsElement /></RouteProtegee>} />
        <Route path="/resume" element={<RouteProtegee><ResumeVoyage /></RouteProtegee>} />
        <Route path="/wishlist" element={<RouteProtegee><Wishlist /></RouteProtegee>} />
        <Route path="*" element={<PageIntrouvable />} />
      </Routes>
    </div>
  );
}
