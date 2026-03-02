import { useState } from "react";
import Login from "./pages/Login";
import Accueil from "./pages/Home";
import SelectionDestination from "./pages/SelectionDestination.jsx";

export default function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [page, setPage] = useState("accueil");
  const [recherche, setRecherche] = useState(null);

  function surDeconnexion() {
    setUtilisateur(null);
    setPage("accueil");
    setRecherche(null);
  }

  function surRecherche(infoRecherche) {
    setRecherche(infoRecherche);
    setPage("selection");
  }

  if (!utilisateur) {
    return <Login onLogin={setUtilisateur} />;
  }

  if (page === "selection" && recherche) {
    return (
      <SelectionDestination
        recherche={recherche}
        surRetourAccueil={() => setPage("accueil")}
        surVoirRecapitulatif={(recap) => {
          // pour l'instant, tu peux juste log
          console.log("Récap:", recap);
        }}
      />
    );
  }
  return (
    <Accueil
      utilisateur={utilisateur}
      surDeconnexion={surDeconnexion}
      surRecherche={surRecherche}
    />
  );
}
