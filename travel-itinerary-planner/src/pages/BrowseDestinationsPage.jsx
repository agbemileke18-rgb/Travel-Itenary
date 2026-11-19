import { useEffect, useMemo, useState } from 'react'
import { Compass, RotateCcw, SearchX } from 'lucide-react'
import Button from '../components/Button.jsx'
import DestinationCard from '../components/DestinationCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import SearchBar from '../components/SearchBar.jsx'
import SortDropdown from '../components/SortDropdown.jsx'
import { destinations } from '../data/destinations.js'
import '../styles/BrowseDestinationsPage.css'

function EmptyState({ onReset }) {
  return (
    <div className="destination-empty" role="status">
      <span className="destination-empty__icon" aria-hidden="true">
        <SearchX size={25} />
      </span>
      <h2>No destinations found</h2>
      <p>Try a different search or clear your filters to see every destination.</p>
      <Button onClick={onReset} variant="secondary">
        <RotateCcw size={16} aria-hidden="true" />
        Reset Filters
      </Button>
    </div>
  )
}

function DestinationSkeleton() {
  return (
    <div className="destination-skeleton" aria-hidden="true">
      <div className="destination-skeleton__image" />
      <div className="destination-skeleton__body">
        <div className="destination-skeleton__line destination-skeleton__line--short" />
        <div className="destination-skeleton__line destination-skeleton__line--title" />
        <div className="destination-skeleton__line" />
        <div className="destination-skeleton__line destination-skeleton__line--medium" />
      </div>
    </div>
  )
}

export default function BrowseDestinationsPage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All regions')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name-asc')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 350)
    return () => window.clearTimeout(loadingTimer)
  }, [])

  const visibleDestinations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    const results = destinations.filter((destination) => {
      const matchesSearch =
        !query ||
        destination.name.toLocaleLowerCase().includes(query) ||
        destination.country.toLocaleLowerCase().includes(query)
      const matchesRegion = region === 'All regions' || destination.region === region
      const matchesCategory = category === 'All' || destination.category === category
      return matchesSearch && matchesRegion && matchesCategory
    })

    return results.sort((first, second) => {
      switch (sortBy) {
        case 'name-desc':
          return second.name.localeCompare(first.name)
        case 'budget-asc':
          return first.estimatedDailyBudget - second.estimatedDailyBudget
        case 'budget-desc':
          return second.estimatedDailyBudget - first.estimatedDailyBudget
        case 'name-asc':
        default:
          return first.name.localeCompare(second.name)
      }
    })
  }, [category, region, search, sortBy])

  function resetFilters() {
    setSearch('')
    setRegion('All regions')
    setCategory('All')
    setSortBy('name-asc')
  }

  return (
    <main className="browse-page">
      <section className="browse-page__intro">
        <span className="landing-kicker">
          <Compass size={15} aria-hidden="true" />
          Find your next chapter
        </span>
        <h1>Where will you wander?</h1>
        <p>Browse places near and far, then find the one that feels like yours.</p>
      </section>

      <section className="browse-controls" aria-label="Search and filter destinations">
        <SearchBar
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by destination or country"
          value={search}
        />
        <div className="browse-controls__bottom">
          <FilterPanel
            category={category}
            onCategoryChange={setCategory}
            onRegionChange={setRegion}
            region={region}
          />
          <SortDropdown onChange={setSortBy} value={sortBy} />
        </div>
      </section>

      <section className="browse-results" aria-label="Destination results">
        <div className="browse-results__heading">
          <h2>{isLoading ? 'Discovering places' : 'Explore destinations'}</h2>
          {!isLoading && (
            <span>
              {visibleDestinations.length} {visibleDestinations.length === 1 ? 'place' : 'places'}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="browse-destination-grid" aria-busy="true" aria-live="polite">
            {Array.from({ length: 6 }, (_, index) => (
              <DestinationSkeleton key={index} />
            ))}
          </div>
        ) : visibleDestinations.length ? (
          <div className="browse-destination-grid">
            {visibleDestinations.map((destination) => (
              <DestinationCard destination={destination} key={destination.id} />
            ))}
          </div>
        ) : (
          <EmptyState onReset={resetFilters} />
        )}
      </section>
    </main>
  )
}
