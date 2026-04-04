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
          <option value="pertinence">Pertinence</option>
          <option value="prix-croissant">Prix croissant</option>
          <option value="prix-decroissant">Prix décroissant</option>
          <option value="nom">Nom</option>
        </select>
      </label>
      <label className="champ-formulaire">
      <span>Catégories</span>
      <div className="groupe-checkbox">
        {['Électronique', 'Vêtements', 'Maison'].map((cat) => (
          <label key={cat} className="option-checkbox">
            <input
              type="checkbox"
              checked={categoriesSelectionnees.includes(cat)}
              onChange={(e) => {
                const nouvelleSelection = e.target.checked
                  ? [...categoriesSelectionnees, cat]
                  : categoriesSelectionnees.filter((c) => c !== cat);
                definirCategoriesSelectionnees(nouvelleSelection);
              }}
            />
            {cat}
          </label>
        ))}
      </label>
  );
}
