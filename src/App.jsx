import { useState } from "react";
import Login from "./pages/Login";
import Accueil from "./pages/Home";
import Recapitulatif from "./pages/Recapitulatif.jsx";
import SelectionDestination from "./pages/SelectionDestination.jsx";

export default function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [page, setPage] = useState("accueil");
  const [recherche, setRecherche] = useState(null);
  const [selectionRecapitulatif, setSelectionRecapitulatif] = useState(null);

  function surDeconnexion() {
    setUtilisateur(null);
    setPage("accueil");
    setRecherche(null);
    setSelectionRecapitulatif(null);
  }

  function surRecherche(informationRecherche) {
    setRecherche(informationRecherche);
    setPage("selection");
  }

  function surVoirRecapitulatif(nouvelleSelection) {
    setSelectionRecapitulatif(nouvelleSelection);
    setPage("recapitulatif");
  }

  function surRetourAccueil() {
    setPage("accueil");
  }

  function surRetourSelection() {
    setPage("selection");
  }

  if (!utilisateur) {
    return <Login onLogin={setUtilisateur} />;
  }

  if (page === "selection" && recherche) {
    return (
      <SelectionDestination
        recherche={recherche}
        surRetourAccueil={surRetourAccueil}
        surVoirRecapitulatif={surVoirRecapitulatif}
      />
    );
  }

  if (page === "recapitulatif" && selectionRecapitulatif) {
    return (
      <Recapitulatif
        selection={selectionRecapitulatif}
        surRetourSelection={surRetourSelection}
        surRetourAccueil={surRetourAccueil}
        surMettreAJourSelection={setSelectionRecapitulatif}
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
