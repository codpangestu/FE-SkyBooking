import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Plane, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import authService from '../services/authService';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        ...(isAuthenticated ? [{ name: 'My Bookings', path: '/profile' }] : []),
        { name: 'Flights', path: '/all-flights' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass shadow-2xl bg-slate-950/80' : 'py-6 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="bg-primary-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                        <Plane className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-gradient">
                        SkyBooking
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-slate-300 hover:text-white transition-colors font-medium"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors font-medium border-l border-slate-700 pl-8"
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 glass px-4 py-2 rounded-xl border-slate-700 hover:border-slate-500 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-slate-200">{user?.name}</span>
                                <ChevronDown size={16} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-48 glass-card rounded-2xl p-2 shadow-2xl scale-in-center">
                                    <Link
                                        to="/profile"
                                        className="flex items-center space-x-3 p-3 hover:bg-slate-800/50 rounded-xl transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User size={18} />
                                        <span>Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-3 p-3 w-full text-left text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="btn-premium py-2 px-6">
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-slate-300"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass-card mt-2 mx-6 rounded-2xl p-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-lg font-medium text-slate-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="text-lg font-medium text-primary-400"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Admin Dashboard
                        </Link>
                    )}
                    <hr className="border-slate-700" />
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/profile"
                                className="flex items-center space-x-3 text-lg font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User size={20} />
                                <span>Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 text-lg font-medium text-red-400"
                            >
                                <LogOut size={20} />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/login"
                                className="text-center py-3 glass rounded-xl"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn-premium text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
