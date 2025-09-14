# PsychSupport - Psychological Support System

A React-based mental health companion application designed to provide psychological support, mood tracking, assessments, and resources for mental wellness.

## Features

- **Dashboard**: Overview of mood trends, quick actions, and recent activities
- **Mental Health Assessments**: Interactive questionnaires to track mental health status
- **Resource Library**: Curated mental health resources, exercises, and guides
- **User Profile**: Personal settings and preferences management
- **Authentication**: Secure login and registration system

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common UI elements
│   ├── forms/          # Form components
│   └── charts/         # Data visualization components
├── pages/              # Main application pages
├── context/            # React context providers
├── services/           # API and external service integrations
├── utils/              # Utility functions and helpers
├── styles/             # CSS and styling files
├── hooks/              # Custom React hooks
└── assets/             # Images, icons, and static files
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Key Components

### Authentication
The app uses a context-based authentication system with local storage for session management.

### Routing
React Router is used for navigation between different pages:
- `/` - Dashboard
- `/login` - Login/Signup page
- `/assessment` - Mental health assessment
- `/resources` - Resource library
- `/profile` - User profile and settings

### Styling
The app uses CSS custom properties (CSS variables) for consistent theming and responsive design.

## Development Notes

- The app is currently set up with mock data for development purposes
- API integration points are prepared in the services layer
- Authentication is simulated with local storage
- All components are designed to be responsive and accessible

## Future Enhancements

- Backend API integration
- Real-time notifications
- Data visualization with charts
- Progressive Web App (PWA) features
- Multi-language support
- Dark mode theme

## Contributing

This is a development project. Follow standard React development practices and ensure all components are properly tested.

## License

This project is for educational and development purposes.
