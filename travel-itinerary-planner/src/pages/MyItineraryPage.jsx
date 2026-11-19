import { useState } from 'react'
import { ArrowRight, CalendarDays, MapPin, Plus, Trash2, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import ActivityForm from '../components/ActivityForm.jsx'
import Button from '../components/Button.jsx'
import ItineraryDay from '../components/ItineraryDay.jsx'
import Modal from '../components/Modal.jsx'
import { destinations } from '../data/destinations.js'
import { useTrips } from '../context/TripContext.jsx'
import '../styles/MyItineraryPage.css'

function getDateForTripDay(startDate, day) {
  const date = new Date(`${startDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + day - 1)
  return date.toISOString().slice(0, 10)
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateString}T12:00:00`))
}

function EmptyItinerary() {
  return (
    <main className="itinerary-empty-page">
      <span className="itinerary-empty-page__icon" aria-hidden="true">
        <CalendarDays size={27} />
      </span>
      <span className="landing-kicker">Your next adventure starts here</span>
      <h1>Your itinerary is waiting.</h1>
      <p>Create a trip to gather places, plans, and the little details all in one spot.</p>
      <Link className="itinerary-empty-page__cta" to="/trip/new">
        <Plus size={17} aria-hidden="true" />
        Create Your First Trip
      </Link>
    </main>
  )
}

export default function MyItineraryPage() {
  const navigate = useNavigate()
  const {
    activeTrip,
    activeTripId,
    addActivity,
    deleteActivity,
    deleteTrip,
    setActiveTripId,
    trips,
    updateActivity,
  } = useTrips()
  const [activityModalOpen, setActivityModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(1)
  const [editingActivity, setEditingActivity] = useState(null)
  const [activityError, setActivityError] = useState('')
  const [tripDeleteOpen, setTripDeleteOpen] = useState(false)
  const [tripError, setTripError] = useState('')

  if (!trips.length) {
    return <EmptyItinerary />
  }

  const destination = activeTrip
    ? destinations.find((item) => item.id === activeTrip.destinationId)
    : null

  function openAddActivity(day) {
    setSelectedDay(day)
    setEditingActivity(null)
    setActivityError('')
    setActivityModalOpen(true)
  }

  function openEditActivity(activity) {
    setSelectedDay(activity.day)
    setEditingActivity(activity)
    setActivityError('')
    setActivityModalOpen(true)
  }

  function closeActivityModal() {
    setActivityModalOpen(false)
    setActivityError('')
  }

  function saveActivity(activity) {
    if (!activeTrip) return
    setActivityError('')
    try {
      if (editingActivity) {
        updateActivity(activeTrip.id, editingActivity.id, activity)
      } else {
        addActivity(activeTrip.id, activity)
      }
      closeActivityModal()
    } catch (error) {
      setActivityError(
        error instanceof Error ? error.message : 'Unable to save this activity.',
      )
    }
  }

  function removeActivity(activityId) {
    if (!activeTrip) return
    deleteActivity(activeTrip.id, activityId)
  }

  function confirmDeleteTrip() {
    if (!activeTrip) return
    setTripError('')
    try {
      deleteTrip(activeTrip.id)
      setTripDeleteOpen(false)
    } catch (error) {
      setTripError(error instanceof Error ? error.message : 'Unable to delete this trip.')
    }
  }

  if (!activeTrip) {
    return (
      <main className="itinerary-page itinerary-page--choose">
        <span className="landing-kicker">Your travel plans</span>
        <h1>Choose a trip to view</h1>
        <label className="itinerary-switcher">
          <span>Trip</span>
          <select
            onChange={(event) => setActiveTripId(event.target.value || null)}
            value={activeTripId ?? ''}
          >
            <option value="">Choose a trip</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.tripName}
              </option>
            ))}
          </select>
        </label>
      </main>
    )
  }

  return (
    <main className="itinerary-page">
      <header className="itinerary-page__heading">
        <div>
          <span className="landing-kicker">Your travel plans</span>
          <h1>My Itinerary</h1>
        </div>
        {trips.length > 1 && (
          <label className="itinerary-switcher">
            <span>Switch trip</span>
            <select
              onChange={(event) => setActiveTripId(event.target.value)}
              value={activeTrip.id}
            >
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.tripName}
                </option>
              ))}
            </select>
          </label>
        )}
      </header>

      <section className="itinerary-summary" aria-label="Trip summary">
        <div className="itinerary-summary__main">
          <div className="itinerary-summary__badges">
            {destination && <span>{destination.region}</span>}
            <span>{activeTrip.totalDays} days</span>
          </div>
          <h2>{activeTrip.tripName}</h2>
          <p className="itinerary-summary__destination">
            <MapPin size={16} aria-hidden="true" />
            {destination
              ? `${destination.name}, ${destination.country}`
              : 'Destination details unavailable'}
          </p>
          <div className="itinerary-summary__dates">
            <CalendarDays size={16} aria-hidden="true" />
            <span>
              {formatDate(activeTrip.startDate)} – {formatDate(activeTrip.endDate)}
            </span>
            {destination && (
              <span className="itinerary-summary__budget">
                <Wallet size={16} aria-hidden="true" />~
                ${destination.estimatedDailyBudget} / day
              </span>
            )}
          </div>
        </div>
        <div className="itinerary-summary__actions">
          <Button
            onClick={() => navigate(`/trip/edit/${encodeURIComponent(activeTrip.id)}`)}
            variant="secondary"
          >
            Edit Trip
          </Button>
          <Button onClick={() => setTripDeleteOpen(true)} variant="danger">
            <Trash2 size={16} aria-hidden="true" />
            Delete Trip
          </Button>
        </div>
      </section>

      <div className="itinerary-days-heading">
        <div>
          <h2>Day by day</h2>
          <p>Make a plan, then leave a little room for magic.</p>
        </div>
        <span>{activeTrip.activities.length} planned activities</span>
      </div>

      <div className="itinerary-days">
        {Array.from({ length: activeTrip.totalDays }, (_, index) => {
          const day = index + 1
          const date = getDateForTripDay(activeTrip.startDate, day)
          const dayActivities = activeTrip.activities.filter((activity) => activity.day === day)
          return (
            <ItineraryDay
              activities={dayActivities}
              date={date}
              day={day}
              key={day}
              onAddActivity={openAddActivity}
              onDeleteActivity={removeActivity}
              onEditActivity={openEditActivity}
            />
          )
        })}
      </div>

      <Link className="itinerary-page__more-link" to="/destinations">
        Discover more places
        <ArrowRight size={17} aria-hidden="true" />
      </Link>

      <Modal
        isOpen={activityModalOpen}
        onClose={closeActivityModal}
        title={editingActivity ? 'Edit activity' : `Add an activity to Day ${selectedDay}`}
      >
        <ActivityForm
          day={selectedDay}
          errorMessage={activityError}
          initialActivity={editingActivity}
          key={`${activeTrip.id}-${editingActivity?.id ?? `new-${selectedDay}`}`}
          onCancel={closeActivityModal}
          onSubmit={saveActivity}
          totalDays={activeTrip.totalDays}
        />
      </Modal>

      <Modal
        isOpen={tripDeleteOpen}
        onClose={() => setTripDeleteOpen(false)}
        title="Delete this trip?"
      >
        <p className="itinerary-delete-copy">
          “{activeTrip.tripName}” and its itinerary will be permanently removed.
        </p>
        {tripError && (
          <p className="itinerary-delete-error" role="alert">
            {tripError}
          </p>
        )}
        <div className="itinerary-delete-actions">
          <Button onClick={() => setTripDeleteOpen(false)} variant="secondary">
            Keep Trip
          </Button>
          <Button onClick={confirmDeleteTrip} variant="danger">
            Delete Trip
          </Button>
        </div>
      </Modal>
    </main>
  )
}
