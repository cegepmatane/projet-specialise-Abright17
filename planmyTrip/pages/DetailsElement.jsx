import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import CarteInteractive from "../composants/CarteInteractive.jsx";
import {
  evenementsPlanMyTrip,
  lireResumeVoyage,
  lireWishlist,
  sauvegarderResumeVoyage,
  sauvegarderWishlist,
} from "../services/stockageLocal.js";
import {
  ajouterOuRetirerElementListe,
  creerImageSecours,
  lireElementsParCategorie,
  trouverVilleParNom,
} from "../services/voyage.js";

function elementEstDansResume(resumeVoyage, categorie, element) {
  if (!resumeVoyage || !element) {
    return false;
  }

  if (categorie === "hebergements") {
    return resumeVoyage.hebergement?.id === element.id;
  }

  if (categorie === "transports") {
    return resumeVoyage.transport?.id === element.id;
  }

  if (categorie === "activites") {
    return (resumeVoyage.activites || []).some((item) => item.id === element.id);
  }

  if (categorie === "restaurants") {
    return (resumeVoyage.restaurants || []).some((item) => item.id === element.id);
  }

  return false;
}

export default function DetailsElement() {
  const { nomVille, categorie, identifiantElement } = useParams();
  const location = useLocation();
  const ville = trouverVilleParNom(nomVille);
  const listeElements = lireElementsParCategorie(ville, categorie);

  const element = useMemo(
    () => listeElements.find((item) => item.id === identifiantElement),
    [identifiantElement, listeElements]
  );

  const [resumeVoyage, definirResumeVoyage] = useState(() => lireResumeVoyage());
  const [wishlist, definirWishlist] = useState(() => lireWishlist());

  useEffect(() => {
    function rafraichirDonnees() {
      definirResumeVoyage(lireResumeVoyage());
      definirWishlist(lireWishlist());
    }

    rafraichirDonnees();
    window.addEventListener(evenementsPlanMyTrip.resume, rafraichirDonnees);
    window.addEventListener(evenementsPlanMyTrip.wishlist, rafraichirDonnees);

    return () => {
      window.removeEventListener(evenementsPlanMyTrip.resume, rafraichirDonnees);
      window.removeEventListener(evenementsPlanMyTrip.wishlist, rafraichirDonnees);
    };
  }, [identifiantElement, categorie]);

  const estDansResume = elementEstDansResume(resumeVoyage, categorie, element);
  const estDansWishlist = (wishlist || []).some((item) => item.id === element?.id);
  const hebergementChoisi = resumeVoyage?.hebergement || null;

  function gererAjoutOuRetraitResume() {
    const resumeActuel = lireResumeVoyage();
    const resumeMisAJour = {
      ...resumeActuel,
      villeNom: ville.nom,
      nombreDeNuits: resumeActuel.nombreDeNuits || 1,
      nombreDePersonnes: resumeActuel.nombreDePersonnes || 1,
    };

    if (categorie === "hebergements") {
      resumeMisAJour.hebergement =
        resumeActuel.hebergement?.id === element.id ? null : element;
    } else if (categorie === "transports") {
      resumeMisAJour.transport =
        resumeActuel.transport?.id === element.id ? null : element;
    } else if (categorie === "activites") {
      resumeMisAJour.activites = ajouterOuRetirerElementListe(
        resumeActuel.activites,
        element
      );
    } else if (categorie === "restaurants") {
      resumeMisAJour.restaurants = ajouterOuRetirerElementListe(
        resumeActuel.restaurants,
        element
      );
    }

    sauvegarderResumeVoyage(resumeMisAJour);
    definirResumeVoyage(resumeMisAJour);
  }

  function gererAjoutOuRetraitWishlist() {
    const wishlistActuelle = lireWishlist();
    const wishlistMiseAJour = ajouterOuRetirerElementListe(wishlistActuelle, {
      ...element,
      villeNom: ville.nom,
      categorieRoute: categorie,
    });
    sauvegarderWishlist(wishlistMiseAJour);
    definirWishlist(wishlistMiseAJour);
  }

  if (!ville || !element) {
    return (
      <main className="page-contenu">
        <h1>Élément introuvable</h1>
      </main>
    );
  }

  return (
    <main className="page-contenu">
      <section className="page-details">
        <div className="page-details__visuel">
          <img src={element.image || creerImageSecours(element.nom)} alt={element.nom} />
        </div>

        <div className="page-details__contenu">
          <p className="sur-ligne">{ville.nom}</p>
          <h1>{element.nom}</h1>
          <p className="texte-introduction-details">
            {element.description ||
              "Une option élégante pour enrichir ton séjour avec une navigation claire et des informations utiles."}
          </p>

          <div className="boite-informations-details">
            <article>
              <span>Type</span>
              <strong>{element.categorie || element.type || "Voyage"}</strong>
            </article>
            <article>
              <span>Prix</span>
              <strong>{element.prix} $</strong>
            </article>
            <article>
              <span>Adresse</span>
              <strong>{element.adresse || "Information à confirmer"}</strong>
            </article>
          </div>

          <div className="groupe-boutons-actions">
            <button
              type="button"
              className={estDansResume ? "bouton-retirer" : "bouton-primaire"}
              onClick={gererAjoutOuRetraitResume}
            >
              {estDansResume ? "Retirer du résumé" : "Ajouter au résumé"}
            </button>
            <button
              type="button"
              className={estDansWishlist ? "bouton-wishlist-actif" : "bouton-secondaire"}
              onClick={gererAjoutOuRetraitWishlist}
            >
              {estDansWishlist ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
            </button>
            <Link
              className="bouton-fantome"
              to={location.state?.depuis || `/ville/${encodeURIComponent(ville.nom)}/${categorie}`}
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </section>

      <section className="section-contenu section-carte-details">
        <div className="entete-section">
          <div>
            <p className="sur-ligne">Localisation</p>
            <h2>Carte interactive</h2>
          </div>
        </div>
        <CarteInteractive element={element} hebergement={categorie === "hebergements" ? null : hebergementChoisi} />
      </section>
    </main>
  );
}
