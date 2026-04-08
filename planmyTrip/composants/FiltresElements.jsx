export default function FiltresElements({
  filtreTexte,
  definirFiltreTexte,
  triActuel,
  definirTriActuel,
  filtrePrixMaximum,
  definirFiltrePrixMaximum,
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

      <label className="champ-formulaire">
        <span>Prix maximum</span>
        <input
          type="number"
          min="0"
          value={filtrePrixMaximum}
          onChange={(evenement) => definirFiltrePrixMaximum(evenement.target.value)}
          placeholder="Ex: 150"
        />
      </label>

      <label className="champ-formulaire">
        <span>Trier par</span>
        <select
          value={triActuel}
          onChange={(evenement) => definirTriActuel(evenement.target.value)}
        >
          <option value="prix-croissant">Prix croissant</option>
          <option value="prix-decroissant">Prix décroissant</option>
        </select>
      </label>
    </aside>
  );
}
