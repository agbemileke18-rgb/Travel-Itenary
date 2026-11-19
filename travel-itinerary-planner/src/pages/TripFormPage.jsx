import { useState } from 'react'
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import TripForm from '../components/TripForm.jsx'
import { destinations } from '../data/destinations.js'
import { useTrips } from '../context/TripContext.jsx'
import '../styles/TripFormPage.css'

function getLocalDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDefaultDates() {
  const start = new Date()
  const end = new Date(start)
  end.setDate(end.getDate() + 2)
  return {
    startDate: getLocalDateString(start),
    endDate: getLocalDateString(end),
  }
}

export default function TripFormPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { trips, createTrip, updateTrip } = useTrips()
  const [submitError, setSubmitError] = useState('')
  const trip = id ? trips.find((item) => item.id === id) : null
  const requestedDestinationId = searchParams.get('destinationId') ?? ''
  const destinationId = destinations.some(
    (destination) => destination.id === requestedDestinationId,
  )
    ? requestedDestinationId
    : ''
  const initialValues = trip
    ? {
        tripName: trip.tripName,
        destinationId: trip.destinationId,
        startDate: trip.startDate,
        endDate: trip.endDate,
      }
    : { tripName: '', destinationId, ...getDefaultDates() }

  function handleSubmit(values) {
    setSubmitError('')
    try {
      if (trip) {
        updateTrip(trip.id, values)
      } else {
        createTrip(values)
      }
      navigate('/itinerary')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save this trip.')
    }
  }

  if (id && !trip) {
    return (
      <main className="trip-form-page trip-form-page--not-found">
        <span className="trip-form-page__icon" aria-hidden="true">
          <BriefcaseBusiness size={22} />
        </span>
        <h1>Trip not found</h1>
        <p>This trip may have been deleted or the link may be incorrect.</p>
        <Link className="trip-form-page__back-link" to="/itinerary">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to itinerary
        </Link>
      </main>
    )
  }

  return (
    <main className="trip-form-page">
      <Link className="trip-form-page__back-link" to="/itinerary">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to itinerary
      </Link>

      <section className="trip-form-page__card">
        <div className="trip-form-page__intro">
          <span className="trip-form-page__icon" aria-hidden="true">
            <BriefcaseBusiness size={22} />
          </span>
          <span className="landing-kicker">
            {trip ? 'Make it your own' : 'A new adventure'}
          </span>
          <h1>{trip ? 'Edit your trip' : 'Plan a new trip'}</h1>
          <p>
            {trip
              ? 'Update the details and keep your plans in sync.'
              : 'Choose a destination and dates. You can build the day-by-day plan next.'}
          </p>
        </div>

        <TripForm
          errorMessage={submitError}
          initialValues={initialValues}
          key={trip?.id ?? `new-trip-${destinationId}`}
          onSubmit={handleSubmit}
          submitLabel={trip ? 'Save Changes' : 'Create Trip'}
        />
      </section>
    </main>
  )
}
