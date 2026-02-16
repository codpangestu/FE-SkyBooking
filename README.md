# 🛫 SkyBooking Frontend

SkyBooking is a premium, high-performance flight booking application built with a focus on visual excellence and seamless user experience. This repository contains the frontend implementation, featuring a modern dark-themed aesthetic, dynamic flight discovery, and an intuitive booking flow.

## 🛠 Tech Stack

- **Core**: React 18 (Vite)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Reactive & Lightweight)
- **Styling**: Tailwind CSS (Custom Design System)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6
- **Animations**: Tailwind Animate & Transitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0 or higher)
- npm or yarn

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/codpangestu/FE-SkyBooking.git
   cd FE-SkyBooking
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory and add your backend API URL:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Launch development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## 🧠 Key Implementations

### 🔗 API Integration
The application interacts with a RESTful Laravel API. We use a centralized Axios instance (`src/services/api.js`) with:
- **Automatic Interceptors**: Attaches JWT tokens to every request if available.
- **Resource Standard**: Consumes nested JSON resources for efficient data transfer (flights, segments, facilities).

### ⚡ React Implementation & State Management
- **Zustand**: Used for high-performance state management (`src/store/`). 
  - `useAuthStore`: Manages user sessions and authentication logic.
  - `useBookingStore`: Persists flight selection and booking metadata across the multi-step flow.
- **Hooks**: Custom hooks like `usePricing` handle complex business logic (calculating taxes and subtotals) outside of the UI components.

### 🎨 Styling & Aesthetic
- **Premium Dark Theme**: Implements a consistent dark-mode design system with glassmorphism effects (`glass-card`).
- **Dynamic Cabin Maps**: The seat selection page dynamically generates aircraft layouts based on the `total_seats` metadata provided by the admin.
- **Responsive Layouts**: Fully optimized for mobile, tablet, and desktop viewing.

### 🛡️ Admin Dashboard
While this is a React frontend, the system is integrated with a **Laravel Filament** admin dashboard. 
- **Filament Integration**: Admins can manage flights, airports, airlines, and facilities. 
- **Live Sync**: Changes made in the Filament dashboard (like updating seat counts or adding amenities) are reflected immediately in this frontend through automated data mapping.

---
Built by [Akbar Pangestu](https://github.com/codpangestu)
