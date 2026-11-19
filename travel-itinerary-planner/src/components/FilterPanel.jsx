import '../styles/FilterPanel.css'

const defaultRegions = ['Africa', 'Europe', 'Asia', 'Americas', 'Oceania']
const defaultCategories = ['Beach', 'City', 'Nature', 'Cultural', 'Adventure']

export default function FilterPanel({
  category = 'All',
  categories = defaultCategories,
  onCategoryChange,
  onRegionChange,
  region = 'All regions',
  regions = defaultRegions,
}) {
  return (
    <section className="filter-panel" aria-label="Filter destinations">
      <div className="filter-panel__region">
        <label htmlFor="destination-region">Region</label>
        <select
          id="destination-region"
          onChange={(event) => onRegionChange?.(event.target.value)}
          value={region}
        >
          <option value="All regions">All regions</option>
          {regions.map((regionName) => (
            <option key={regionName} value={regionName}>
              {regionName}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="filter-panel__categories">
        <legend>Category</legend>
        <div className="filter-panel__pills">
          {['All', ...categories].map((categoryName) => (
            <button
              aria-pressed={category === categoryName}
              className={`filter-panel__pill${category === categoryName ? ' filter-panel__pill--active' : ''}`}
              key={categoryName}
              onClick={() => onCategoryChange?.(categoryName)}
              type="button"
            >
              {categoryName}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  )
}
