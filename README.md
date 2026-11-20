Travel Itinerary Planner

A responsive React web application that allows travelers to explore destinations, filter and sort travel options, create validated trips, and organize day-by-day travel itineraries.

Built as a React Capstone Project demonstrating component reusability, client-side routing, controlled form validation, dynamic state management, and CRUD operations.

Live Links

Live Demo: https://gleanword-travel-itinerary.vercel.app/

GitHub Repository: https://github.com/agbemileke18-rgb/Travel-Itinerary

Features

Responsive Landing Page: Travel hero section, featured destinations showcase, and clear calls to action.

Browse & Discover Destinations:

Real-time search by destination name or country.

Multi-criteria filtering by region and travel category.

Dynamic sorting (alphabetical and budget-based).

Loading, empty, and error states for smooth user feedback.

Destination Details: Detailed destination overview, regional tags, suggested activities, and one-click Add to Trip functionality.

Create & Edit Trips: Controlled form inputs with client-side validation (required fields, character limits, and chronological start/end date verification).

Day-by-Day Itinerary Management:

Automatically breaks trips down into individual days based on selected dates.

Add, edit, and delete activities per day with time, category, and notes.

Persistent client-side state using localStorage so trip plans remain saved across page reloads.

Tech Stack

Frontend Library: React (Vite)

Routing: React Router

Icons: Lucide React

State Management: React Context API & Hooks (useState, useEffect, useContext)

Deployment: Vercel

Project Structure

src/
├── components/       # Reusable UI components (Navbar, Footer, DestinationCard, SearchBar, FilterPanel, SortDropdown, TripForm, ActivityForm, ItineraryDay, ActivityItem, Modal, Button)
├── context/          # Global state and localStorage persistence (TripContext)
├── data/             # Mock destination datasets and initial sample trip data
├── pages/            # Route-level views (LandingPage, BrowseDestinationsPage, DestinationDetailsPage, TripFormPage, MyItineraryPage)
├── styles/           # Responsive styling files
├── App.jsx           # Application routes and layout wrapper
└── main.jsx          # Entry point


Getting Started (Local Setup)

Follow these steps to run the project locally on your machine:

Clone the repository:

git clone https://github.com/agbemileke18-rgb/Travel-Itenary.git


Navigate into the project directory:

cd Travel-Itenary


Install dependencies:

npm install


Start the development server:

npm run dev


Open in browser:
Visit the local URL shown in your terminal (typically http://localhost:5173).

Capstone Deliverables Checklist

[x] Responsive React application (mobile & desktop)

[x] Dynamic data rendering with search, filter, and sort

[x] Controlled forms with client-side validation

[x] Day-by-day activity CRUD operations

[x] Public GitHub repository with meaningful commits

[x] Live deployed application on Vercel
