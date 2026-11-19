import { useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { destinations } from '../data/destinations.js'
import Button from './Button.jsx'
import '../styles/TripForm.css'

function validateTrip(values) {
  const errors = {}
  const tripName = values.tripName.trim()

  if (!tripName) {
    errors.tripName = 'Enter a name for your trip.'
  } else if (tripName.length < 3) {
    errors.tripName = 'Trip name must be at least 3 characters.'
  }
  if (!values.destinationId) errors.destinationId = 'Choose a destination.'
  if (!values.startDate) errors.startDate = 'Choose a start date.'
  if (!values.endDate) errors.endDate = 'Choose an end date.'
  if (values.startDate && values.endDate && values.endDate < values.startDate) {
    errors.endDate = 'End date cannot be earlier than the start date.'
  }

  return errors
}

export default function TripForm({
  errorMessage = '',
  initialValues = {},
  onSubmit,
  submitLabel = 'Save Trip',
}) {
  const [values, setValues] = useState(() => ({
    tripName: initialValues.tripName ?? '',
    destinationId: initialValues.destinationId ?? '',
    startDate: initialValues.startDate ?? '',
    endDate: initialValues.endDate ?? '',
  }))
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateTrip(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    onSubmit({
      tripName: values.tripName.trim(),
      destinationId: values.destinationId,
      startDate: values.startDate,
      endDate: values.endDate,
    })
  }

  return (
    <form className="trip-form" noValidate onSubmit={handleSubmit}>
      {errorMessage && (
        <p className="trip-form__submit-error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="trip-form__field">
        <label htmlFor="trip-name">Trip name</label>
        <input
          aria-describedby={errors.tripName ? 'trip-name-error' : undefined}
          aria-invalid={Boolean(errors.tripName)}
          autoComplete="off"
          id="trip-name"
          name="tripName"
          onChange={handleChange}
          placeholder="e.g. Summer in Kyoto"
          value={values.tripName}
        />
        {errors.tripName && (
          <span className="trip-form__error" id="trip-name-error">
            {errors.tripName}
          </span>
        )}
      </div>

      <div className="trip-form__field">
        <label htmlFor="trip-destination">
          <MapPin size={15} aria-hidden="true" />
          Destination
        </label>
        <select
          aria-describedby={errors.destinationId ? 'trip-destination-error' : undefined}
          aria-invalid={Boolean(errors.destinationId)}
          id="trip-destination"
          name="destinationId"
          onChange={handleChange}
          value={values.destinationId}
        >
          <option value="">Choose a destination</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}, {destination.country}
            </option>
          ))}
        </select>
        {errors.destinationId && (
          <span className="trip-form__error" id="trip-destination-error">
            {errors.destinationId}
          </span>
        )}
      </div>

      <div className="trip-form__date-grid">
        <div className="trip-form__field">
          <label htmlFor="trip-start-date">
            <CalendarDays size={15} aria-hidden="true" />
            Start date
          </label>
          <input
            aria-describedby={errors.startDate ? 'trip-start-date-error' : undefined}
            aria-invalid={Boolean(errors.startDate)}
            id="trip-start-date"
            name="startDate"
            onChange={handleChange}
            type="date"
            value={values.startDate}
          />
          {errors.startDate && (
            <span className="trip-form__error" id="trip-start-date-error">
              {errors.startDate}
            </span>
          )}
        </div>

        <div className="trip-form__field">
          <label htmlFor="trip-end-date">
            <CalendarDays size={15} aria-hidden="true" />
            End date
          </label>
          <input
            aria-describedby={errors.endDate ? 'trip-end-date-error' : undefined}
            aria-invalid={Boolean(errors.endDate)}
            id="trip-end-date"
            min={values.startDate || undefined}
            name="endDate"
            onChange={handleChange}
            type="date"
            value={values.endDate}
          />
          {errors.endDate && (
            <span className="trip-form__error" id="trip-end-date-error">
              {errors.endDate}
            </span>
          )}
        </div>
      </div>

      <div className="trip-form__actions">
        <Button size="large" type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
