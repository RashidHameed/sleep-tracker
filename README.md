# DreamTracker - Sleep Tracking App

A comprehensive sleep tracking application with analytics, smart reminders, and relaxation tools built using React and Express.

## Features

### Core Sleep Tracking
- **Sleep Logging**: Record bedtime, wake time, sleep quality (1-5 scale), and notes
- **Automatic Duration Calculation**: Real-time calculation of sleep duration
- **Data Persistence**: In-memory storage with full CRUD operations

### Analytics & Insights
- **Visual Charts**: Sleep duration trends and quality patterns using Chart.js
- **Personalized Insights**: Automatic pattern detection and recommendations
- **Weekly Analytics**: Track sleep patterns over time
- **Smart Recommendations**: AI-powered suggestions based on sleep data

### Smart Features
- **Bedtime Reminders**: Configurable notifications for bedtime and wind-down
- **Smart Alarm**: Wake-up window with light sleep phase detection simulation
- **Browser Notifications**: Native notification support with permission handling

### Relaxation Tools
- **Breathing Exercises**: 4-7-8 breathing technique 
- **Sleep Sounds**: Ambient sounds and white noise
- **Sleep Meditation**: Guided meditation sessions

### User Experience
- **Beautiful Dark Theme**: Night sky gradient with glass-effect UI
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: Built with shadcn/ui components for accessibility

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation
- **Chart.js** for data visualization

### Backend
- **Express.js** with TypeScript
- **In-memory storage** for data persistence
- **Zod** for schema validation
- **RESTful API** design

### Development Tools
- **Vite** for build tooling and dev server
- **ESBuild** for production bundling
- **TypeScript** for type safety
- **Drizzle ORM** for database schema (ready for PostgreSQL)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dreamtracker.git
cd dreamtracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Sleep Logs
- `GET /api/sleep-logs` - Get all sleep logs
- `POST /api/sleep-logs` - Create new sleep log
- `DELETE /api/sleep-logs/:id` - Delete specific sleep log
- `DELETE /api/sleep-logs` - Delete all sleep logs

### Analytics
- `GET /api/analytics` - Get sleep analytics and insights

### Reminders
- `GET /api/reminders` - Get all reminders
- `PUT /api/reminders/:id` - Update reminder settings

### Alarm Settings
- `GET /api/alarm-settings` - Get alarm configuration
- `PUT /api/alarm-settings` - Update alarm settings

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── pages/          # Page components
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── components.json        # shadcn/ui configuration
```

## Database Schema

The application uses a simple schema with three main entities:

- **Sleep Logs**: Stores sleep data with bedtime, wake time, quality, and notes
- **Reminders**: Manages bedtime and wind-down notification settings
- **Alarm Settings**: Configures smart alarm preferences

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with love using modern web technologies
- Inspired by the need for better sleep tracking solutions
- Thanks to the open-source community for amazing tools and libraries