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



