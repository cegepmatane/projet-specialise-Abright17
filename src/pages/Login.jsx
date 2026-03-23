import { useMemo, useState } from "react";
import utilisateursJson from "../donnees/user.json";
import { envoyerCourrielBienvenue } from "../services/courriel.js";
import {
  creerUtilisateurLocal,
  lireUtilisateursLocaux,
  sauvegarderUtilisateurConnecte,
} from "../services/stockageLocal.js";

export default function Login() {
  const [modeCreationCompte, definirModeCreationCompte] = useState(false);
  const [prenom, definirPrenom] = useState("");
  const [nom, definirNom] = useState("");
  const [courriel, definirCourriel] = useState("");
  const [motDePasse, definirMotDePasse] = useState("");
  const [confirmationMotDePasse, definirConfirmationMotDePasse] = useState("");
  const [messageErreur, definirMessageErreur] = useState("");
  const [messageSucces, definirMessageSucces] = useState("");

  const listeUtilisateurs = useMemo(() => {
    const utilisateursFichier = Array.isArray(utilisateursJson)
      ? utilisateursJson
      : [utilisateursJson];

    return [...utilisateursFichier, ...lireUtilisateursLocaux()];
  }, [messageSucces]);

  function reinitialiserMessages() {
    definirMessageErreur("");
    definirMessageSucces("");
  }

  function gererConnexion(evenement) {
    evenement.preventDefault();
    reinitialiserMessages();

    const utilisateurTrouve = listeUtilisateurs.find(
      (utilisateur) =>
        utilisateur.email.toLowerCase() === courriel.trim().toLowerCase() &&
        utilisateur.motDePasse === motDePasse
    );

    if (!utilisateurTrouve) {
      definirMessageErreur("Courriel ou mot de passe invalide.");
      return;
    }

    sauvegarderUtilisateurConnecte(utilisateurTrouve);
    window.location.href = "/";
  }

  function gererCreationCompte(evenement) {
    evenement.preventDefault();
    reinitialiserMessages();

    if (!prenom.trim() || !nom.trim() || !courriel.trim() || !motDePasse.trim()) {
      definirMessageErreur("Veuillez remplir tous les champs.");
      return;
    }

    if (motDePasse !== confirmationMotDePasse) {
      definirMessageErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    const courrielExiste = listeUtilisateurs.some(
      (utilisateur) => utilisateur.email.toLowerCase() === courriel.trim().toLowerCase()
    );


    definirPrenom("");
    definirNom("");
    definirCourriel("");
    definirMotDePasse("");
    definirConfirmationMotDePasse("");
  }

  return (
    <main className="page-login">
      <section className="page-login__visuel">
        <div>
          <p className="sur-ligne">PlanMyTrip</p>
          <h1>Une plateforme moderne et intuitive pour planifier vos voyages.</h1>
          <p>
            Connecte-toi, découvre une destination, compose ton séjour et télécharge ton résumé en PDF.
          </p>
        </div>
      </section>

      <section className="page-login__formulaire">
        <form
          className="carte-authentification"
          onSubmit={modeCreationCompte ? gererCreationCompte : gererConnexion}
        >
          <p className="sur-ligne">{modeCreationCompte ? "Créer un compte" : "Connexion"}</p>
          <h2>{modeCreationCompte ? "Créer un compte" : "Bienvenue"}</h2>
          <p className="texte-secondaire">
            {modeCreationCompte
              ? "Créez votre espace personnel pour commencer à organiser vos voyages."
              : "Utilisez votre compte ou créez-en un nouveau en quelques secondes."}
          </p>

          {modeCreationCompte ? (
            <>
              <label className="champ-formulaire">
                <span>Prénom</span>
                <input
                  type="text"
                  value={prenom}
                  onChange={(evenement) => definirPrenom(evenement.target.value)}
                  placeholder="Samuela"
                  required
                />
              </label>

              <label className="champ-formulaire">
                <span>Nom</span>
                <input
                  type="text"
                  value={nom}
                  onChange={(evenement) => definirNom(evenement.target.value)}
                  placeholder="Moussango"
                  required
                />
              </label>
            </>
          ) : null}

          <label className="champ-formulaire">
            <span>Courriel</span>
            <input
              type="email"
              value={courriel}
              onChange={(evenement) => definirCourriel(evenement.target.value)}
              placeholder="samuela@gmail.com"
              required
            />
          </label>

          ) : null}

          {messageErreur ? <p className="message-erreur">{messageErreur}</p> : null}
          {messageSucces ? <p className="message-succes">{messageSucces}</p> : null}

          <button type="submit" className="bouton-primaire bouton-largeur-complete">
            {modeCreationCompte ? "Créer mon compte" : "Se connecter"}
          </button>

        </form>
      </section>
    </main>
  );
}
