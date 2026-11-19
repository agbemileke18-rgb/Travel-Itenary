import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { sampleTrip } from '../data/destinations.js'

const STORAGE_KEY = 'travel-itinerary-planner'
const TripContext = createContext(null)
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

function getDateTimestamp(value, fieldName) {
  if (typeof value !== 'string') {
    throw new TypeError(`${fieldName} must be a date string in YYYY-MM-DD format.`)
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) {
    throw new TypeError(`${fieldName} must be a date string in YYYY-MM-DD format.`)
  }

  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const date = new Date(0)
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCFullYear(year, month - 1, day)

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new TypeError(`${fieldName} is not a valid calendar date.`)
  }

  return date.getTime()
}

function calculateTotalDays(startDate, endDate) {
  const start = getDateTimestamp(startDate, 'startDate')
  const end = getDateTimestamp(endDate, 'endDate')
  const totalDays = Math.floor((end - start) / DAY_IN_MILLISECONDS) + 1

  if (totalDays < 1) {
    throw new RangeError('endDate must be on or after startDate.')
  }

  return totalDays
}

function createId(prefix) {
  const randomUUID = globalThis.crypto?.randomUUID
  return `${prefix}-${randomUUID ? randomUUID.call(globalThis.crypto) : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`
}

function validateActivity(activity, totalDays) {
  if (!activity || typeof activity !== 'object') {
    throw new TypeError('An activity must be an object.')
  }
  if (!Number.isInteger(activity.day) || activity.day < 1 || activity.day > totalDays) {
    throw new RangeError(`Activity day must be an integer from 1 to ${totalDays}.`)
  }
  for (const field of ['time', 'title', 'category']) {
    if (typeof activity[field] !== 'string' || activity[field].trim() === '') {
      throw new TypeError(`Activity ${field} must be a non-empty string.`)
    }
  }
  if (typeof activity.notes !== 'string') {
    throw new TypeError('Activity notes must be a string.')
  }

  return {
    ...activity,
    id: activity.id || createId('activity'),
  }
}

function normalizeTrip(trip) {
  if (!trip || typeof trip !== 'object') {
    throw new TypeError('Trip data must be an object.')
  }
  if (typeof trip.tripName !== 'string' || trip.tripName.trim() === '') {
    throw new TypeError('tripName must be a non-empty string.')
  }
  if (typeof trip.destinationId !== 'string' || trip.destinationId.trim() === '') {
    throw new TypeError('destinationId must be a non-empty string.')
  }

  const totalDays = calculateTotalDays(trip.startDate, trip.endDate)
  if (!Array.isArray(trip.activities ?? [])) {
    throw new TypeError('Trip activities must be an array.')
  }

  return {
    ...trip,
    id: trip.id || createId('trip'),
    totalDays,
    activities: (trip.activities ?? []).map((activity) =>
      validateActivity(activity, totalDays),
    ),
  }
}

function createInitialState() {
  if (typeof window === 'undefined') {
    const trip = normalizeTrip({ ...sampleTrip })
    return { trips: [trip], activeTripId: trip.id }
  }

  const storedState = window.localStorage.getItem(STORAGE_KEY)
  if (!storedState) {
    const trip = normalizeTrip({ ...sampleTrip })
    return { trips: [trip], activeTripId: trip.id }
  }

  const parsedState = JSON.parse(storedState)
  if (!parsedState || !Array.isArray(parsedState.trips)) {
    throw new TypeError('Saved trip data must contain a trips array.')
  }

  const trips = parsedState.trips.map(normalizeTrip)
  const activeTripId = parsedState.activeTripId ?? null
  if (activeTripId !== null && !trips.some((trip) => trip.id === activeTripId)) {
    throw new TypeError('Saved activeTripId does not match a saved trip.')
  }

  return { trips, activeTripId }
}

function tripReducer(state, action) {
  switch (action.type) {
    case 'create': {
      return {
        trips: [...state.trips, action.trip],
        activeTripId: action.trip.id,
      }
    }
    case 'update': {
      return {
        ...state,
        trips: state.trips.map((trip) => (trip.id === action.trip.id ? action.trip : trip)),
      }
    }
    case 'delete': {
      const trips = state.trips.filter((trip) => trip.id !== action.tripId)
      return {
        trips,
        activeTripId:
          state.activeTripId === action.tripId
            ? trips[0]?.id ?? null
            : state.activeTripId,
      }
    }
    case 'set-active':
      return { ...state, activeTripId: action.tripId }
    case 'add-activity':
      return {
        ...state,
        trips: state.trips.map((trip) =>
          trip.id === action.tripId
            ? { ...trip, activities: [...trip.activities, action.activity] }
            : trip,
        ),
      }
    case 'update-activity':
      return {
        ...state,
        trips: state.trips.map((trip) =>
          trip.id === action.tripId
            ? {
                ...trip,
                activities: trip.activities.map((activity) =>
                  activity.id === action.activity.id ? action.activity : activity,
                ),
              }
            : trip,
        ),
      }
    case 'delete-activity':
      return {
        ...state,
        trips: state.trips.map((trip) =>
          trip.id === action.tripId
            ? {
                ...trip,
                activities: trip.activities.filter(
                  (activity) => activity.id !== action.activityId,
                ),
              }
            : trip,
        ),
      }
    default:
      throw new TypeError(`Unknown trip action: ${action.type}`)
  }
}

function getTrip(trips, tripId) {
  const trip = trips.find((item) => item.id === tripId)
  if (!trip) {
    throw new Error(`Trip "${tripId}" was not found.`)
  }
  return trip
}

function getActivity(trip, activityId) {
  const activity = trip.activities.find((item) => item.id === activityId)
  if (!activity) {
    throw new Error(`Activity "${activityId}" was not found in trip "${trip.id}".`)
  }
  return activity
}

function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDaysToDateString(dateString, days) {
  const timestamp = getDateTimestamp(dateString, 'startDate')
  const date = new Date(timestamp + days * DAY_IN_MILLISECONDS)
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-')
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, undefined, createInitialState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const setActiveTripId = useCallback(
    (tripId) => {
      if (tripId !== null && !state.trips.some((trip) => trip.id === tripId)) {
        throw new Error(`Trip "${tripId}" was not found.`)
      }
      dispatch({ type: 'set-active', tripId })
    },
    [state.trips],
  )

  const createTrip = useCallback(
    (tripData) => {
      const trip = normalizeTrip(tripData)
      if (state.trips.some((item) => item.id === trip.id)) {
        throw new Error(`Trip "${trip.id}" already exists.`)
      }
      dispatch({ type: 'create', trip })
      return trip
    },
    [state.trips],
  )

  const updateTrip = useCallback(
    (tripId, updatedData) => {
      if (!updatedData || typeof updatedData !== 'object') {
        throw new TypeError('updatedData must be an object.')
      }
      const existingTrip = getTrip(state.trips, tripId)
      const trip = normalizeTrip({
        ...existingTrip,
        ...updatedData,
        id: existingTrip.id,
        activities: updatedData.activities ?? existingTrip.activities,
      })
      dispatch({ type: 'update', trip })
      return trip
    },
    [state.trips],
  )

  const deleteTrip = useCallback(
    (tripId) => {
      getTrip(state.trips, tripId)
      dispatch({ type: 'delete', tripId })
    },
    [state.trips],
  )

  const addActivity = useCallback(
    (tripId, activityData) => {
      const trip = getTrip(state.trips, tripId)
      const activity = validateActivity(activityData, trip.totalDays)
      if (trip.activities.some((item) => item.id === activity.id)) {
        throw new Error(`Activity "${activity.id}" already exists in trip "${tripId}".`)
      }
      dispatch({ type: 'add-activity', tripId, activity })
      return activity
    },
    [state.trips],
  )

  const updateActivity = useCallback(
    (tripId, activityId, updatedActivity) => {
      const trip = getTrip(state.trips, tripId)
      const existingActivity = getActivity(trip, activityId)
      const activity = validateActivity(
        { ...existingActivity, ...updatedActivity, id: existingActivity.id },
        trip.totalDays,
      )
      dispatch({ type: 'update-activity', tripId, activity })
      return activity
    },
    [state.trips],
  )

  const deleteActivity = useCallback(
    (tripId, activityId) => {
      const trip = getTrip(state.trips, tripId)
      getActivity(trip, activityId)
      dispatch({ type: 'delete-activity', tripId, activityId })
    },
    [state.trips],
  )

  const quickAddSuggestedActivity = useCallback(
    (destination, activityTitle) => {
      if (
        !destination ||
        typeof destination.id !== 'string' ||
        typeof destination.name !== 'string'
      ) {
        throw new TypeError('A destination with an id and name is required.')
      }
      if (typeof activityTitle !== 'string' || activityTitle.trim() === '') {
        throw new TypeError('activityTitle must be a non-empty string.')
      }

      const matchingTrips = state.trips.filter(
        (trip) => trip.destinationId === destination.id,
      )
      const matchingTrip =
        matchingTrips.find((trip) => trip.id === state.activeTripId) ?? matchingTrips[0]
      const activityData = {
        id: createId('activity'),
        day: 1,
        time: '09:00',
        title: activityTitle.trim(),
        category: destination.category ?? 'Suggested',
        notes: 'Added from suggested activities.',
      }

      if (!matchingTrip) {
        const startDate = getTodayDateString()
        const trip = normalizeTrip({
          id: createId('trip'),
          tripName: `${destination.name} Getaway`,
          destinationId: destination.id,
          startDate,
          endDate: addDaysToDateString(startDate, 2),
          activities: [activityData],
        })
        dispatch({ type: 'create', trip })
        return activityData
      }

      if (matchingTrip.id !== state.activeTripId) {
        dispatch({ type: 'set-active', tripId: matchingTrip.id })
      }
      const activity = validateActivity(activityData, matchingTrip.totalDays)
      dispatch({ type: 'add-activity', tripId: matchingTrip.id, activity })
      return activity
    },
    [state.activeTripId, state.trips],
  )

  const value = useMemo(
    () => ({
      trips: state.trips,
      activeTripId: state.activeTripId,
      activeTrip: state.trips.find((trip) => trip.id === state.activeTripId) ?? null,
      setActiveTripId,
      createTrip,
      updateTrip,
      deleteTrip,
      addActivity,
      updateActivity,
      deleteActivity,
      quickAddSuggestedActivity,
    }),
    [
      state.trips,
      state.activeTripId,
      setActiveTripId,
      createTrip,
      updateTrip,
      deleteTrip,
      addActivity,
      updateActivity,
      deleteActivity,
      quickAddSuggestedActivity,
    ],
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useTrips() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider.')
  }
  return context
}
