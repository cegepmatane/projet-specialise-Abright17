import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Accueil from "./pages/Home";
import Recapitulatif from "./pages/Recapitulatif.jsx";
import SelectionDestination from "./pages/SelectionDestination.jsx";

export default function App() {
  const [utilisateur, setUtilisateur] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("planmytrip_utilisateur")) || null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState(() => {
    return localStorage.getItem("planmytrip_page") || "accueil";
  });

  const [recherche, setRecherche] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("planmytrip_recherche")) || null;
    } catch {
      return null;
    }
  });

  const [selectionRecapitulatif, setSelectionRecapitulatif] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("planmytrip_selection")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("planmytrip_page", page);
  }, [page]);

  useEffect(() => {
    if (utilisateur) {
      localStorage.setItem(
        "planmytrip_utilisateur",
        JSON.stringify(utilisateur)
      );
    } else {
      localStorage.removeItem("planmytrip_utilisateur");
    }
  }, [utilisateur]);

  useEffect(() => {
    if (recherche) {
      localStorage.setItem("planmytrip_recherche", JSON.stringify(recherche));
    } else {
      localStorage.removeItem("planmytrip_recherche");
    }
  }, [recherche]);

  useEffect(() => {
    if (selectionRecapitulatif) {
      localStorage.setItem(
        "planmytrip_selection",
        JSON.stringify(selectionRecapitulatif)
      );
    } else {
      localStorage.removeItem("planmytrip_selection");
    }
  }, [selectionRecapitulatif]);

  function gererConnexion(utilisateurConnecte) {
    setUtilisateur(utilisateurConnecte);

    // Au reconnect, on restaure la dernière étape utile
    const selectionSauvegardee = localStorage.getItem("planmytrip_selection");
    const rechercheSauvegardee = localStorage.getItem("planmytrip_recherche");

    if (selectionSauvegardee) {
      setPage("recapitulatif");
    } else if (rechercheSauvegardee) {
      setPage("selection");
    } else {
      setPage("accueil");
    }
  }

  function surDeconnexion() {
    // On déconnecte seulement l'utilisateur
    // MAIS on garde la recherche et le récapitulatif
    setUtilisateur(null);
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

  function recommencerVoyage() {
    localStorage.removeItem("planmytrip_recherche");
    localStorage.removeItem("planmytrip_selection");
    localStorage.removeItem("planmytrip_page");

    setRecherche(null);
    setSelectionRecapitulatif(null);
    setPage("accueil");
  }

  if (!utilisateur) {
    return <Login onLogin={gererConnexion} />;
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
      surRecommencerVoyage={recommencerVoyage}
    />
  );
}
