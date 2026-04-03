import donneesVoyage from "../donnees/data.json";

export function lireToutesLesVilles() {
  return Array.isArray(donneesVoyage?.villes) ? donneesVoyage.villes : [];
}

export function trouverVilleParNom(nomVilleRecherchee) {
  const nomNormalise = String(nomVilleRecherchee || "").trim().toLowerCase();
  return lireToutesLesVilles().find((ville) => ville.nom.toLowerCase() === nomNormalise) || null;
}

export function lireElementsParCategorie(ville, categorie) {
  if (!ville || !categorie) {
    return [];
  }

  return Array.isArray(ville[categorie]) ? ville[categorie] : [];
}

export function creerImageSecours(texte) {
  return `https://placehold.co/1200x800/F6DDBF/11233B?text=${encodeURIComponent(texte || "PlanMyTrip")}`;
}

export function formaterPrix(prix) {
  return `${Number(prix || 0).toFixed(0)} $`;
}

export function calculerSousTotal(resumeVoyage) {
  if (!resumeVoyage) {
    return 0;
  }

  const nombreDeNuits = Number(resumeVoyage.nombreDeNuits || 1);
  const nombreDePersonnes = Number(resumeVoyage.nombreDePersonnes || 1);

  let total = 0;

  if (resumeVoyage.hebergement) {
    total += (Number(resumeVoyage.hebergement.prix) || 0) * nombreDeNuits;
  }

  if (resumeVoyage.transport) {
    total += Number(resumeVoyage.transport.prix) || 0;
  }

  (resumeVoyage.activites || []).forEach((activite) => {
    total += (Number(activite.prix) || 0) * nombreDePersonnes;
  });

  (resumeVoyage.restaurants || []).forEach((restaurant) => {
    total += (Number(restaurant.prix) || 0) * nombreDePersonnes;
  });

  return total;
}

export function ajouterOuRetirerElementListe(liste = [], element) {
  const elementExiste = liste.some((elementListe) => elementListe.id === element.id);
  return elementExiste
    ? liste.filter((elementListe) => elementListe.id !== element.id)
    : [...liste, element];
}

export function calculerDistanceHaversineEnKm(lat1, lng1, lat2, lng2) {
  const convertirEnRadians = (valeur) => (valeur * Math.PI) / 180;
  const rayonTerre = 6371;
  const differenceLatitude = convertirEnRadians(lat2 - lat1);
  const differenceLongitude = convertirEnRadians(lng2 - lng1);

  const a =
    Math.sin(differenceLatitude / 2) * Math.sin(differenceLatitude / 2) +
    Math.cos(convertirEnRadians(lat1)) *
      Math.cos(convertirEnRadians(lat2)) *
      Math.sin(differenceLongitude / 2) *
      Math.sin(differenceLongitude / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return rayonTerre * c;
}

export function determinerMessageProximite(distanceEnKm) {
  if (distanceEnKm <= 2) {
    return "Très proche de votre hébergement";
  }

  if (distanceEnKm <= 5) {
    return "Assez proche de votre hébergement";
  }

  return "Plus éloigné de votre hébergement";
}

export function determinerClasseProximite(distanceEnKm) {
  if (distanceEnKm <= 2) {
    return "badge-distance badge-distance--proche";
  }

  if (distanceEnKm <= 5) {
    return "badge-distance badge-distance--moyen";
  }

  return "badge-distance badge-distance--loin";
}
