import { CalendarDays, Plus } from 'lucide-react'
import Button from './Button.jsx'
import ActivityItem from './ActivityItem.jsx'
import '../styles/ItineraryDay.css'

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`)
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export default function ItineraryDay({
  activities,
  date,
  day,
  onAddActivity,
  onDeleteActivity,
  onEditActivity,
}) {
  const sortedActivities = [...activities].sort((first, second) =>
    first.time.localeCompare(second.time),
  )

  return (
    <section className="itinerary-day" aria-labelledby={`itinerary-day-${day}`}>
      <header className="itinerary-day__header">
        <div className="itinerary-day__date-icon" aria-hidden="true">
          <CalendarDays size={19} />
        </div>
        <div>
          <h2 id={`itinerary-day-${day}`}>
            Day {day} <span>— {formatDate(date)}</span>
          </h2>
          <p>
            {sortedActivities.length
              ? `${sortedActivities.length} ${sortedActivities.length === 1 ? 'activity' : 'activities'} planned`
              : 'A day with room to explore'}
          </p>
        </div>
        <Button
          className="itinerary-day__add"
          onClick={() => onAddActivity(day)}
          size="small"
          variant="secondary"
        >
          <Plus size={16} aria-hidden="true" />
          Add Activity
        </Button>
      </header>

      {sortedActivities.length ? (
        <div className="itinerary-day__activities">
          {sortedActivities.map((activity) => (
            <ActivityItem
              activity={activity}
              key={activity.id}
              onDelete={onDeleteActivity}
              onEdit={onEditActivity}
            />
          ))}
        </div>
      ) : (
        <div className="itinerary-day__empty">
          <p>Nothing planned yet. Keep the day open or add an activity you are excited about.</p>
        </div>
      )}
    </section>
  )
}
