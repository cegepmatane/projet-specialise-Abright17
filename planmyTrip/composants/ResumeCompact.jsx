import { useEffect, useState } from "react";
import { Link } from "react-router";
import { evenementsPlanMyTrip, lireResumeVoyage } from "../services/stockageLocal.js";
import { calculerSousTotal } from "../services/voyage.js";

export default function ResumeCompact() {
  const [resumeVoyage, definirResumeVoyage] = useState(() => lireResumeVoyage());

  useEffect(() => {
    function rafraichirResume() {
      definirResumeVoyage(lireResumeVoyage());
    }

    window.addEventListener(evenementsPlanMyTrip.resume, rafraichirResume);
    return () => window.removeEventListener(evenementsPlanMyTrip.resume, rafraichirResume);
  }, []);

  const sousTotal = calculerSousTotal(resumeVoyage);
  const nombreElements =
    (resumeVoyage?.hebergement ? 1 : 0) +
    (resumeVoyage?.transport ? 1 : 0) +
    (resumeVoyage?.activites?.length || 0) +
    (resumeVoyage?.restaurants?.length || 0);

  return (
    <Link to="/resume" className="resume-compact">
      <span className="resume-compact__etiquette">Sous-total</span>
      <strong>{sousTotal.toFixed(2)} $</strong>
      <span className="resume-compact__elements">{nombreElements} choix</span>
    </Link>
  );
}
