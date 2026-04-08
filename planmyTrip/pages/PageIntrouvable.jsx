import { Link } from "react-router";

export default function PageIntrouvable() {
  return (
    <main className="page-contenu page-introuvable">
      <p className="sur-ligne">Erreur 404</p>
      <h1>Page introuvable</h1>
      <Link to="/" className="bouton-primaire">Retour à l'accueil</Link>
    </main>
  );
}
