import { lireUtilisateurConnecte } from "../services/stockageLocal.js";

export default function PageContact() {
  const utilisateurConnecte = lireUtilisateurConnecte();

  return (
    <main className="page-contenu">
      <section className="entete-page-categorie">
        <div>
          <p className="sur-ligne">Contact</p>
          <h1>On prépare votre prochain départ ensemble ?</h1>
          <p>Vous avez une question sur une destination ou besoin d'un coup de pouce pour votre itinéraire ? Notre équipe est là pour vous aider à transformer vos envies en réalité.</p>
        </div>
      </section>

      <section className="grille-informations-contact">
        <article className="carte-simple carte-simple--texte">
          <h2>Vos informations</h2>
          <p><strong>Identité :</strong> {utilisateurConnecte?.prenom || "Voyageur"} {utilisateurConnecte?.nom || ""}</p>
          <p><strong>Courriel de contact :</strong> {utilisateurConnecte?.email || "hello@planmytrip.io"}</p>
          <p><strong>Disponibilité :</strong> On vous répond avec le sourire en moins de 24h.</p>
        </article>

        <article className="carte-simple carte-simple--texte">
          <h2>Besoin d'aide ?</h2>
          <p>Que ce soit pour une demande d'info sur un hébergement, un souci technique sur le site ou simplement pour nous partager vos meilleures adresses, on adore vous lire !</p>
          <p>PlanMyTrip est une plateforme pensée pour vous, alors n'hésitez pas à nous faire vos retours pour qu'on s'améliore encore.</p>
        </article>
      </section>
    </main>
  );
}
