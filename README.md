# Lead Management System

A modern web application built with Next.js for managing sales leads and opportunities. This system provides a comprehensive solution for tracking, managing, and analyzing sales leads with features including authentication, lead management, and data visualization.

## Features

- **User Authentication**: Secure login and registration system
- **Lead Management**: Create, read, update, and delete lead information
- **Dashboard**: Visual representation of lead statistics and key metrics
- **Responsive Design**: Mobile-first approach using Material-UI components
- **Role-Based Access**: Different access levels for various user roles

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **UI Framework**: Material-UI (MUI)
- **Authentication**: Custom JWT-based authentication
- **State Management**:
  - React Context API for auth state
  - SWR for server state and data fetching
- **Type Safety**: TypeScript
- **Styling**: Emotion (MUI's styling solution)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.0.0 or higher)
- npm or yarn package manager
- Git

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/mcewball13/webdev-assesment.git
   cd webdev-assesment
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:

   ```bash
   JWT_SECRET=your-jwt-secret
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```text
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context providers
│   ├── lib/            # Utility functions and helpers
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── data/              # Mock data and database schemas
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run start` - Runs the production server
- `npm run lint` - Runs ESLint for code linting

## Contact

Michael McEwen - [mcewball13@gmail.com](mailto:mcewball13@gmail.com)
Project Link: [https://github.com/mcewball13/webdev-assesment](https://github.com/mcewball13/webdev-assesment)
