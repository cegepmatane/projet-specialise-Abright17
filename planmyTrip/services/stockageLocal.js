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

export function sauvegarderUtilisateurConnecte(utilisateur) {
  localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(utilisateur));
  diffuserEvenement(evenementsPlanMyTrip.utilisateur);
}

export function supprimerUtilisateurConnecte() {
  localStorage.removeItem(CLE_UTILISATEUR);
  diffuserEvenement(evenementsPlanMyTrip.utilisateur);
}

export function lireUtilisateursLocaux() {
  return lireJson(CLE_UTILISATEURS_LOCAUX, []);
}

export function sauvegarderUtilisateursLocaux(utilisateurs) {
  localStorage.setItem(CLE_UTILISATEURS_LOCAUX, JSON.stringify(utilisateurs));
  diffuserEvenement(evenementsPlanMyTrip.utilisateursLocaux);
}

export function creerUtilisateurLocal(utilisateur) {
  const utilisateurs = lireUtilisateursLocaux();
  sauvegarderUtilisateursLocaux([...utilisateurs, utilisateur]);
}

export function lireRechercheVoyage() {
  return lireJson(creerCleUtilisateur("recherche"), {
    nomVille: "",
    nombreDePersonnes: 2,
    nombreDeNuits: 1,
  });
}

export function sauvegarderRechercheVoyage(rechercheVoyage) {
  localStorage.setItem(creerCleUtilisateur("recherche"), JSON.stringify(rechercheVoyage));
  diffuserEvenement(evenementsPlanMyTrip.recherche);
}

export function lireResumeVoyage() {
  return lireJson(creerCleUtilisateur("resume"), {
    villeNom: "",
    nombreDePersonnes: 1,
    nombreDeNuits: 1,
    hebergement: null,
    transport: null,
    activites: [],
    restaurants: [],
  });
}

export function sauvegarderResumeVoyage(resumeVoyage) {
  localStorage.setItem(creerCleUtilisateur("resume"), JSON.stringify(resumeVoyage));
  diffuserEvenement(evenementsPlanMyTrip.resume);
}

export function lireWishlist() {
  return lireJson(creerCleUtilisateur("wishlist"), []);
}

export function sauvegarderWishlist(wishlist) {
  localStorage.setItem(creerCleUtilisateur("wishlist"), JSON.stringify(wishlist));
  diffuserEvenement(evenementsPlanMyTrip.wishlist);
}

export function lireHistoriqueRecherche() {
  return lireJson(creerCleUtilisateur("historique_recherche"), []);
}

export function ajouterRechercheHistorique(rechercheVoyage) {
  const historiqueActuel = lireHistoriqueRecherche();
  const cleRecherche = `${rechercheVoyage.nomVille}-${rechercheVoyage.nombreDeNuits}-${rechercheVoyage.nombreDePersonnes}`;

  const historiqueFiltre = historiqueActuel.filter((element) => {
    const cleElement = `${element.nomVille}-${element.nombreDeNuits}-${element.nombreDePersonnes}`;
    return cleElement !== cleRecherche;
  });

  const nouvelHistorique = [rechercheVoyage, ...historiqueFiltre].slice(0, 6);
  localStorage.setItem(creerCleUtilisateur("historique_recherche"), JSON.stringify(nouvelHistorique));
  diffuserEvenement(evenementsPlanMyTrip.historique);
}
