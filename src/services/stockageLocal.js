export const evenementsPlanMyTrip = {
  utilisateur: "planmytrip:utilisateur-mis-a-jour",
  recherche: "planmytrip:recherche-mise-a-jour",
  resume: "planmytrip:resume-mis-a-jour",
  wishlist: "planmytrip:wishlist-mise-a-jour",
  historique: "planmytrip:historique-mis-a-jour",
  utilisateursLocaux: "planmytrip:utilisateurs-locaux-mis-a-jour",
};

const CLE_UTILISATEUR = "planmytrip_utilisateur_connecte";
const CLE_UTILISATEURS_LOCAUX = "planmytrip_utilisateurs_locaux";

function lireJson(cle, valeurParDefaut) {
  try {
    const valeur = localStorage.getItem(cle);
    return valeur ? JSON.parse(valeur) : valeurParDefaut;
  } catch {
    return valeurParDefaut;
  }
}

function diffuserEvenement(nomEvenement) {
  window.dispatchEvent(new Event(nomEvenement));
}

export function lireUtilisateurConnecte() {
  return lireJson(CLE_UTILISATEUR, null);
}

function creerCleUtilisateur(suffixe) {
  const utilisateurConnecte = lireUtilisateurConnecte();

  if (!utilisateurConnecte) {
    return `planmytrip_invite_${suffixe}`;
  }

  const identifiantUtilisateur =
    utilisateurConnecte.id || utilisateurConnecte.email || "utilisateur";

  return `planmytrip_${identifiantUtilisateur}_${suffixe}`;
}
