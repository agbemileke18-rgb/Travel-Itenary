import { useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Check, MapPin, Wallet } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '../components/Button.jsx'
import { destinations } from '../data/destinations.js'
import { useTrips } from '../context/TripContext.jsx'
import '../styles/DestinationDetailsPage.css'

function DestinationNotFound() {
  return (
    <main className="destination-not-found">
      <span className="destination-not-found__code">404</span>
      <h1>We could not find that destination.</h1>
      <p>It may have moved, or the link might not be quite right.</p>
      <Link className="destination-back-link" to="/destinations">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to destinations
      </Link>
    </main>
  )
}

export default function DestinationDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { quickAddSuggestedActivity } = useTrips()
  const [addedActivities, setAddedActivities] = useState([])
  const destination = destinations.find((item) => item.id === id)

  if (!destination) {
    return <DestinationNotFound />
  }

  function handleQuickAdd(activityTitle) {
    quickAddSuggestedActivity(destination, activityTitle)
    setAddedActivities((current) =>
      current.includes(activityTitle) ? current : [...current, activityTitle],
    )
  }

  function handleCreateTrip() {
    navigate(`/trip/new?destinationId=${encodeURIComponent(destination.id)}`)
  }

  return (
    <main className="destination-details">
      <Link className="destination-back-link" to="/destinations">
        <ArrowLeft size={17} aria-hidden="true" />
        All destinations
      </Link>

      <section className="destination-details__hero">
        <img
          alt={`${destination.name}, ${destination.country}`}
          className="destination-details__image"
          src={destination.image}
        />
        <div className="destination-details__hero-shade" />
        <div className="destination-details__hero-content">
          <div className="destination-details__badges">
            <span>{destination.region}</span>
            <span>{destination.category}</span>
          </div>
          <h1>{destination.name}</h1>
          <p>
            <MapPin size={17} aria-hidden="true" />
            {destination.country}
          </p>
        </div>
      </section>

      <div className="destination-details__layout">
        <div className="destination-details__main">
          <section className="destination-details__about">
            <span className="landing-kicker">Get to know the place</span>
            <h2>A little more about {destination.name}</h2>
            <p>{destination.description}</p>
          </section>

          <section className="destination-activities" aria-labelledby="activities-title">
            <div className="destination-activities__heading">
              <div>
                <span className="landing-kicker">Make it yours</span>
                <h2 id="activities-title">Suggested Activities</h2>
              </div>
              <span>{destination.suggestedActivities.length} ideas</span>
            </div>

            <ul className="destination-activities__list">
              {destination.suggestedActivities.map((activityTitle, index) => {
                const isAdded = addedActivities.includes(activityTitle)
                return (
                  <li className="destination-activity" key={activityTitle}>
                    <span className="destination-activity__number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="destination-activity__title">{activityTitle}</span>
                    <Button
                      disabled={isAdded}
                      onClick={() => handleQuickAdd(activityTitle)}
                      size="small"
                      variant={isAdded ? 'secondary' : 'ghost'}
                    >
                      {isAdded ? (
                        <>
                          <Check size={15} aria-hidden="true" />
                          Added
                        </>
                      ) : (
                        '+ Add to Trip'
                      )}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        <aside className="destination-details__sidebar" aria-label="Trip planning information">
          <div className="destination-details__planning-card">
            <span className="landing-kicker">Start dreaming</span>
            <h2>Make this your next trip.</h2>
            <div className="destination-details__meta">
              <div>
                <Wallet size={17} aria-hidden="true" />
                <span>
                  <strong>${destination.estimatedDailyBudget}</strong> estimated daily budget
                </span>
              </div>
              <div>
                <CalendarDays size={17} aria-hidden="true" />
                <span>
                  Best season: <strong>{destination.bestSeason}</strong>
                </span>
              </div>
            </div>
            <Button className="destination-details__create" onClick={handleCreateTrip} size="large">
              Create Trip Here
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </div>
        </aside>
      </div>
    </main>
  )
}
