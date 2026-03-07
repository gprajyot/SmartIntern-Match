# SmartIntern Match Pro - Frontend

AI-Powered Smart Internship Recommendation & Career Assistant Platform

## Overview

A modern, production-ready React.js frontend for an AI-based internship matching platform. Features a premium SaaS-style interface with glassmorphism effects, smooth animations, and intelligent recommendation systems.

## Tech Stack

- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: Context API
- **Animations**: Framer Motion
- **Charts**: Chart.js & React Chart.js 2
- **Icons**: Heroicons
- **Progress Indicators**: React Circular Progressbar

## Features

### Authentication
- Modern login and registration pages
- Role-based access (Student, Company, Admin)
- JWT token management
- Protected routes

### Student Dashboard
- AI-powered internship recommendations
- Real-time match percentage display
- Advanced filtering (location, industry)
- Search functionality
- Save and apply to internships
- Profile completion tracking
- AI skill suggestions

### Company Dashboard
- Internship posting and management
- Applicant tracking system
- Match score visualization
- Accept/reject applications
- Edit and delete internships

### Admin Dashboard
- Platform analytics
- User statistics
- Interactive charts (Line & Doughnut)
- External internship refresh functionality
- Industry distribution insights

### Additional Features
- Floating AI chatbot
- Responsive design
- Dark theme with gradient backgrounds
- Glassmorphism UI effects
- Smooth page transitions
- Profile management

## Project Structure

```
src/
├── pages/
│   ├── Landing.jsx              # Landing page
│   ├── Login.jsx                # Login page
│   ├── Register.jsx             # Registration page
│   ├── StudentDashboard.jsx     # Student dashboard
│   ├── CompanyDashboard.jsx     # Company dashboard
│   ├── AdminDashboard.jsx       # Admin dashboard
│   └── Profile.jsx              # User profile page
│
├── components/
│   ├── Navbar.jsx               # Navigation bar
│   ├── Sidebar.jsx              # Dashboard sidebar
│   ├── InternshipCard.jsx       # Internship display card
│   ├── MatchProgress.jsx        # Circular progress indicator
│   ├── Chatbot.jsx              # AI chatbot component
│   ├── StatsCard.jsx            # Statistics card
│   └── ProtectedRoute.jsx       # Route protection wrapper
│
├── context/
│   └── AuthContext.jsx          # Authentication context
│
├── services/
│   └── api.js                   # API service layer
│
├── layouts/
│   └── DashboardLayout.jsx      # Dashboard layout wrapper
│
├── App.jsx                      # Main app component
├── main.jsx                     # Entry point
└── index.css                    # Global styles
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## API Integration

The frontend connects to a Flask REST API backend. All API calls are centralized in `src/services/api.js`:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Student Endpoints
- `GET /api/student/recommendations` - Get AI recommendations
- `GET /api/student/applications` - Get user applications
- `POST /api/student/apply/:id` - Apply to internship
- `POST /api/student/save/:id` - Save internship
- `GET /api/student/saved` - Get saved internships
- `PUT /api/student/profile` - Update profile
- `GET /api/student/stats` - Get statistics

### Company Endpoints
- `GET /api/company/internships` - Get all internships
- `POST /api/company/internships` - Create internship
- `PUT /api/company/internships/:id` - Update internship
- `DELETE /api/company/internships/:id` - Delete internship
- `GET /api/company/internships/:id/applicants` - Get applicants
- `PUT /api/company/applications/:id` - Update application status
- `GET /api/company/stats` - Get statistics

### Admin Endpoints
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/students` - Get all students
- `GET /api/admin/companies` - Get all companies
- `GET /api/admin/internships` - Get all internships
- `POST /api/admin/refresh-internships` - Refresh external internships
- `GET /api/admin/analytics` - Get analytics data

### Chatbot Endpoint
- `POST /api/chatbot` - Send message to AI chatbot

## Design System

### Color Palette
- **Primary**: Indigo-600 (#4f46e5)
- **Secondary**: Violet-600 (#7c3aed)
- **Accent**: Cyan-400 (#22d3ee)
- **Background**: Dark gradient (gray-950 → gray-900 → black)

### UI Components
- Glassmorphism cards with `bg-white/5` and backdrop blur
- Smooth transitions on hover
- Gradient buttons with shadow effects
- Rounded corners (2xl)
- Consistent spacing system

### Typography
- Font Family: Inter
- Headings: Gradient text effects
- Body: Gray-400 for secondary text

## Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Student dashboard (protected)
- `/company/dashboard` - Company dashboard (protected)
- `/admin/dashboard` - Admin dashboard (protected)
- `/profile` - User profile (protected)

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is automatically attached to all API requests
4. Protected routes check authentication status
5. Role-based access control restricts unauthorized access

## Responsive Design

The application is fully responsive with breakpoints for:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

Sidebar collapses on mobile devices with a hamburger menu.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of components
- Optimized bundle size
- Image optimization
- Efficient re-renders with React hooks

## Deployment

Build the production bundle:
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL (required)

## License

All rights reserved - 2024 SmartIntern Match Pro

## Support

For issues or questions, please contact the development team.
