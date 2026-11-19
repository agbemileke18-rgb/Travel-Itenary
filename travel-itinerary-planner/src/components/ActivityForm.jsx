import { useState } from 'react'
import Button from './Button.jsx'
import '../styles/ActivityForm.css'

const activityCategories = ['Sightseeing', 'Food', 'Adventure', 'Transport', 'Relaxation']

function validateActivity(values, totalDays) {
  const errors = {}
  const day = Number(values.day)

  if (!Number.isInteger(day) || day < 1 || day > totalDays) {
    errors.day = 'Choose a valid trip day.'
  }
  if (!values.time) errors.time = 'Choose a time.'
  if (!values.title.trim()) errors.title = 'Enter an activity name.'
  if (!activityCategories.includes(values.category)) {
    errors.category = 'Choose an activity category.'
  }

  return errors
}

export default function ActivityForm({
  day = 1,
  errorMessage = '',
  initialActivity,
  onCancel,
  onSubmit,
  totalDays,
}) {
  const [values, setValues] = useState(() => ({
    day: String(initialActivity?.day ?? day),
    time: initialActivity?.time ?? '09:00',
    title: initialActivity?.title ?? '',
    category: activityCategories.includes(initialActivity?.category)
      ? initialActivity.category
      : 'Sightseeing',
    notes: initialActivity?.notes ?? '',
  }))
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateActivity(values, totalDays)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    onSubmit({
      day: Number(values.day),
      time: values.time,
      title: values.title.trim(),
      category: values.category,
      notes: values.notes.trim(),
    })
  }

  return (
    <form className="activity-form" noValidate onSubmit={handleSubmit}>
      {errorMessage && (
        <p className="activity-form__submit-error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="activity-form__row">
        <div className="activity-form__field">
          <label htmlFor="activity-day">Trip day</label>
          <select
            aria-describedby={errors.day ? 'activity-day-error' : undefined}
            aria-invalid={Boolean(errors.day)}
            id="activity-day"
            name="day"
            onChange={handleChange}
            value={values.day}
          >
            {Array.from({ length: totalDays }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                Day {index + 1}
              </option>
            ))}
          </select>
          {errors.day && (
            <span className="activity-form__error" id="activity-day-error">
              {errors.day}
            </span>
          )}
        </div>

        <div className="activity-form__field">
          <label htmlFor="activity-time">Time</label>
          <input
            aria-describedby={errors.time ? 'activity-time-error' : undefined}
            aria-invalid={Boolean(errors.time)}
            id="activity-time"
            name="time"
            onChange={handleChange}
            type="time"
            value={values.time}
          />
          {errors.time && (
            <span className="activity-form__error" id="activity-time-error">
              {errors.time}
            </span>
          )}
        </div>
      </div>

      <div className="activity-form__field">
        <label htmlFor="activity-title">Activity</label>
        <input
          aria-describedby={errors.title ? 'activity-title-error' : undefined}
          aria-invalid={Boolean(errors.title)}
          id="activity-title"
          name="title"
          onChange={handleChange}
          placeholder="What are you planning?"
          value={values.title}
        />
        {errors.title && (
          <span className="activity-form__error" id="activity-title-error">
            {errors.title}
          </span>
        )}
      </div>

      <div className="activity-form__field">
        <label htmlFor="activity-category">Category</label>
        <select
          aria-describedby={errors.category ? 'activity-category-error' : undefined}
          aria-invalid={Boolean(errors.category)}
          id="activity-category"
          name="category"
          onChange={handleChange}
          value={values.category}
        >
          {activityCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="activity-form__error" id="activity-category-error">
            {errors.category}
          </span>
        )}
      </div>

      <div className="activity-form__field">
        <label htmlFor="activity-notes">Notes <span>(optional)</span></label>
        <textarea
          id="activity-notes"
          name="notes"
          onChange={handleChange}
          placeholder="Add a meeting point, booking detail, or reminder"
          rows={3}
          value={values.notes}
        />
      </div>

      <div className="activity-form__actions">
        {onCancel && (
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        )}
        <Button type="submit">{initialActivity ? 'Save Activity' : 'Add Activity'}</Button>
      </div>
    </form>
  )
}
