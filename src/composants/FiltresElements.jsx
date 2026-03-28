export default function FiltresElements({
  filtreTexte,
  definirFiltreTexte,
  triActuel,
}) {
  return (
    <aside className="panneau-filtres">
      <h3>Filtres avancés</h3>

      <label className="champ-formulaire">
        <span>Recherche</span>
        <input
          type="text"
          value={filtreTexte}
          onChange={(evenement) => definirFiltreTexte(evenement.target.value)}
          placeholder="Nom ou catégorie"
        />
      </label>
    </aside>
  );
}
