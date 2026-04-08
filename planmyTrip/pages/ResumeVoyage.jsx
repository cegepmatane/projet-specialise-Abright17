import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import {
  evenementsPlanMyTrip,
  lireResumeVoyage,
  sauvegarderResumeVoyage,
} from "../services/stockageLocal.js";
import { calculerSousTotal } from "../services/voyage.js";

function LigneResume({ titre, description, prix, onRetirer }) {
  return (
    <div className="ligne-resume-voyage">
      <div>
        <h3>{titre}</h3>
        <p>{description}</p>
      </div>
      <div className="ligne-resume-voyage__droite">
        <strong>{prix}</strong>
        <button type="button" className="bouton-secondaire" onClick={onRetirer}>
          Retirer
        </button>
      </div>
    </div>
  );
}

export default function ResumeVoyage() {
  const navigate = useNavigate();
  const [resumeVoyage, definirResumeVoyage] = useState(() => lireResumeVoyage());

  useEffect(() => {
    function rafraichirResume() {
      definirResumeVoyage(lireResumeVoyage());
    }

    window.addEventListener(evenementsPlanMyTrip.resume, rafraichirResume);
    return () => window.removeEventListener(evenementsPlanMyTrip.resume, rafraichirResume);
  }, []);

  const sousTotal = useMemo(() => calculerSousTotal(resumeVoyage), [resumeVoyage]);
  const taxes = useMemo(() => sousTotal * 0.15, [sousTotal]);
  const total = useMemo(() => sousTotal + taxes, [sousTotal, taxes]);

  const estVide =
    !resumeVoyage.hebergement &&
    !resumeVoyage.transport &&
    !(resumeVoyage.activites || []).length &&
    !(resumeVoyage.restaurants || []).length;

  function mettreAJourResume(nouveauResume) {
    sauvegarderResumeVoyage(nouveauResume);
    definirResumeVoyage(nouveauResume);
  }

  function telechargerResumePdf() {
    const documentPdf = new jsPDF();
    let hauteurCourante = 20;

    function ecrireLigne(texte, decalage = 8) {
      documentPdf.text(texte, 14, hauteurCourante);
      hauteurCourante += decalage;
    }

    documentPdf.setFontSize(18);
    ecrireLigne("Résumé du voyage", 10);
    documentPdf.setFontSize(11);
    ecrireLigne(`Destination : ${resumeVoyage?.villeNom || "À définir"}`);
    ecrireLigne(`Personnes : ${resumeVoyage?.nombreDePersonnes || 1}`);
    ecrireLigne(`Nuits : ${resumeVoyage?.nombreDeNuits || 1}`, 10);

    if (resumeVoyage.hebergement) {
      ecrireLigne(`Hébergement : ${resumeVoyage.hebergement.nom}`);
    }

    if (resumeVoyage.transport) {
      ecrireLigne(`Transport : ${resumeVoyage.transport.nom}`);
    }

    (resumeVoyage.activites || []).forEach((activite) => {
      ecrireLigne(`Activité : ${activite.nom}`);
    });

    (resumeVoyage.restaurants || []).forEach((restaurant) => {
      ecrireLigne(`Restaurant : ${restaurant.nom}`);
    });

    hauteurCourante += 6;
    ecrireLigne(`Sous-total : ${sousTotal.toFixed(2)} $`);
    ecrireLigne(`Taxes : ${taxes.toFixed(2)} $`);
    ecrireLigne(`Total : ${total.toFixed(2)} $`);

    documentPdf.save("resume-voyage-planmytrip.pdf");
  }

  return (
    <main className="page-contenu">
      <section className="entete-page-categorie">
        <div>
          <p className="sur-ligne">Ton panier voyage</p>
          <h1>Résumé des choix</h1>
          <p>
            {resumeVoyage?.villeNom || "Destination à définir"} • {resumeVoyage?.nombreDePersonnes || 1} personne(s) • {resumeVoyage?.nombreDeNuits || 1} nuit(s)
          </p>
        </div>
      </section>

      <section className="bloc-resume-voyage">
        {resumeVoyage.hebergement ? (
          <LigneResume
            titre={resumeVoyage.hebergement.nom}
            description={`${resumeVoyage.hebergement.categorie} . ${resumeVoyage.hebergement.prix} $ par nuit`}
            prix={`${((Number(resumeVoyage.hebergement.prix) || 0) * (Number(resumeVoyage.nombreDeNuits) || 1)).toFixed(2)} $`}
            onRetirer={() => mettreAJourResume({ ...resumeVoyage, hebergement: null })}
          />
        ) : null}

        {resumeVoyage.transport ? (
          <LigneResume
            titre={resumeVoyage.transport.nom}
            description={resumeVoyage.transport.type || "Transport"}
            prix={`${Number(resumeVoyage.transport.prix || 0).toFixed(2)} $`}
            onRetirer={() => mettreAJourResume({ ...resumeVoyage, transport: null })}
          />
        ) : null}

        {(resumeVoyage.activites || []).map((activite) => (
          <LigneResume
            key={activite.id}
            titre={activite.nom}
            description={`${activite.categorie} . ${resumeVoyage.nombreDePersonnes || 1} personne(s)`}
            prix={`${((Number(activite.prix) || 0) * (Number(resumeVoyage.nombreDePersonnes) || 1)).toFixed(2)} $`}
            onRetirer={() =>
              mettreAJourResume({
                ...resumeVoyage,
                activites: (resumeVoyage.activites || []).filter((element) => element.id !== activite.id),
              })
            }
          />
        ))}

        {(resumeVoyage.restaurants || []).map((restaurant) => (
          <LigneResume
            key={restaurant.id}
            titre={restaurant.nom}
            description={`${restaurant.categorie} • ${resumeVoyage.nombreDePersonnes || 1} personne(s)`}
            prix={`${((Number(restaurant.prix) || 0) * (Number(resumeVoyage.nombreDePersonnes) || 1)).toFixed(2)} $`}
            onRetirer={() =>
              mettreAJourResume({
                ...resumeVoyage,
                restaurants: (resumeVoyage.restaurants || []).filter((element) => element.id !== restaurant.id),
              })
            }
          />
        ))}

        {estVide ? (
          <article className="carte-vide">
            <h2>Aucun élément sélectionné</h2>
            <p>Ajoute des éléments depuis les pages de détails pour compléter ton voyage.</p>
          </article>
        ) : null}
      </section>

      <section className="encart-total-resume encart-total-resume--colonne">
        <div className="ligne-total">
          <span>Sous-total</span>
          <strong>{sousTotal.toFixed(2)} $</strong>
        </div>

        <div className="ligne-total">
          <span>Taxes (15 %)</span>
          <strong>{taxes.toFixed(2)} $</strong>
        </div>

        <div className="ligne-total ligne-total-final">
          <span>Total</span>
          <strong>{total.toFixed(2)} $</strong>
        </div>

        <div className="groupe-boutons-actions groupe-boutons-actions--compact groupe-boutons-actions--resume">
          <button type="button" className="bouton-primaire" onClick={telechargerResumePdf} disabled={estVide}>
            Télécharger le PDF
          </button>
        </div>

      </section>
    </main>
  );
}
