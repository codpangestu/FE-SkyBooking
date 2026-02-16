import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import AllFlights from './pages/AllFlights';
import FlightDetail from './pages/FlightDetail';
import FlightClass from './pages/FlightClass';
import FlightSeat from './pages/FlightSeat';
import PassengerDetail from './pages/PassengerDetail';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Airports from './pages/Airports';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/airports" element={<Airports />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Auth Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/all-flights" element={<AllFlights />} />
              <Route path="/flight-detail/:id" element={<FlightDetail />} />
              <Route path="/flight-class/:id" element={<FlightClass />} />
              <Route path="/flight-seat/:id" element={<FlightSeat />} />
              <Route path="/passenger-detail" element={<PassengerDetail />} />
              <Route path="/payment" element={<Payment />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
