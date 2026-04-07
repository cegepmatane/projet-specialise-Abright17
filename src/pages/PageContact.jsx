import { lireUtilisateurConnecte } from "../services/stockageLocal.js";

export default function PageContact() {
  const utilisateurConnecte = lireUtilisateurConnecte();

  return (
    <main className="page-contenu">
      <section className="entete-page-categorie">
        <div>
          <p className="sur-ligne">Contact</p>
          <h1>Parlons de ton prochain voyage</h1>
          <p>Une page contact simple pour ton portfolio, avec un ton professionnel et un design cohérent.</p>
        </div>
      </section>

      <section className="grille-informations-contact">
        <article className="carte-simple carte-simple--texte">
          <h2>Coordonnées</h2>
          <p><strong>Nom :</strong> {utilisateurConnecte?.prenom || "Voyageur"} {utilisateurConnecte?.nom || ""}</p>
          <p><strong>Courriel :</strong> {utilisateurConnecte?.email || "contact@planmytrip.local"}</p>
          <p><strong>Délai de réponse :</strong> 24 à 48 heures</p>
        </article>

        <article className="carte-simple carte-simple--texte">
          <h2>Pourquoi nous écrire ?</h2>
          <p>Tu peux utiliser cette section pour présenter un formulaire de prise de contact, une demande d'information ou un accompagnement personnalisé pour un séjour.</p>
          <p>Elle donne un rendu plus fini au site et complète bien la navigation principale.</p>
        </article>
      </section>
    </main>
  );
}
