# Map Pin Board

A modern, responsive map-based application built with React, TypeScript, and TailwindCSS. Users can drop pins on an interactive map, view a dynamic list of pins with reverse-geocoded addresses, and manage their pin collection. :))

## Features

### Core Functionality
- **Interactive Map**: Click anywhere on the map to drop a pin
- **Pin Management**: View all pins in a dynamic list with coordinates and addresses
- **Reverse Geocoding**: Automatic address lookup using OpenStreetMap Nominatim API
- **Pin Deletion**: Remove pins from both the map and list

### Technical Features
- **Modern Stack**: React 18 + TypeScript + Vite
- **State Management**: React Context + useState with persistence
- **Styling**: TailwindCSS with custom design system
- **Mapping**: React Leaflet with OpenStreetMap tiles
- **Routing**: React Router with protected routes
- **Authentication**: Simple demo authentication system
- **Local Storage**: Persistent pin data across sessions

### Bonus Features

- **Responsive Design**: Adaptive layout that feels native on mobile, tablet, and desktop
- **Animated UI**: Framer Motion micro-interactions for pins, lists, and controls
- **Persistent State**: Pins and preferences survive browser refreshes via local storage
- **Draggable Pins**: Reposition markers directly on the map with automatic reverse geocoding
- **Vercel Ready**: Production configuration optimized for instant Vercel deployments
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint + Prettier configuration
- **Performance**: Optimized with React best practices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, PostCSS
- **State Management**: React useState
- **Routing**: React Router DOM
- **Maps**: React Leaflet, Leaflet
- **Icons**: Lucide React
- **Development**: ESLint, Prettier, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd map-pin-board
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Main, etc.)
│   └── ui/             # Base UI components (Button, Input, etc.)
├── config/             # Application configuration
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services and external integrations
├── store/              # React context store for state management
├── styles/             # Global styles and TailwindCSS
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main App component with routing
└── main.tsx            # Application entry point
```

## Architecture

### State Management
- **React Context Store**: Centralized state management with persistence
- **Local Storage**: Automatic data persistence across sessions
- **Type Safety**: Full TypeScript coverage for all state

### Component Architecture
- **Atomic Design**: Components organized by complexity and reusability(I prefer in big project but not used so much in this task.)
- **Custom Hooks**: Reusable logic for geocoding, viewport detection, etc.
- **Service Layer**: Clean separation of API calls and external integrations

### Responsive Design
- **Mobile-First**: Designed for mobile and scaled up
- **Breakpoint System**: Custom breakpoints for different viewport types
- **Adaptive Layout**: Components that adapt to screen size

## API Integration

### Geocoding Service
- **Provider**: OpenStreetMap Nominatim API
- **Caching**: Built-in caching to reduce API calls
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: Respectful API usage

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main branch

## Demo Credentials

For the demo authentication:
- **Email**: test@gmail.com
- **Password**: password123

## Acknowledgments

- OpenStreetMap contributors for map data
- React Leaflet for map integration
- TailwindCSS for styling framework
- React useState for state management