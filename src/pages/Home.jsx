import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightSearch from '../components/FlightSearch';
import AirportCard from '../components/AirportCard';
import { Plane, ShieldCheck, Clock, Award, Loader2 } from 'lucide-react';
import flightService from '../services/flightService';

const Home = () => {
    const navigate = useNavigate();
    const [featuredAirports, setFeaturedAirports] = useState([]);
    const [isLoadingAirports, setIsLoadingAirports] = useState(false);

    useEffect(() => {
        const fetchFeaturedAirports = async () => {
            setIsLoadingAirports(true);
            try {
                const data = await flightService.getAirports();
                const list = Array.isArray(data) ? data : data?.data;
                // Just take first 4 for the "Popular" section
                setFeaturedAirports(Array.isArray(list) ? list.slice(0, 4) : []);
            } catch (error) {
                console.error('Failed to fetch featured airports:', error);
            } finally {
                setIsLoadingAirports(false);
            }
        };
        fetchFeaturedAirports();
    }, []);

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 px-6">
                {/* Animated Background Elements */}
                <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-secondary-600/10 rounded-full blur-[150px] animate-pulse"></div>

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full border-primary-500/30">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                                </span>
                                <span className="text-sm font-medium text-primary-300">New premium routes available</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                                Fly Beyond <br />
                                <span className="text-gradient">Your Imagination</span>
                            </h1>

                            <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                                Discover the world in unparalleled comfort. Book premium flights with the fastest, most secure booking system.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('/airports')}
                                    className="btn-premium px-8">Explores Destination</button>
                                <button className="glass px-8 py-3 rounded-xl font-semibold hover:bg-slate-800/50 transition-all">Support</button>
                            </div>
                        </div>

                        <div className="hidden lg:block relative group animate-in fade-in zoom-in duration-1000">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-secondary-600/20 rounded-[40px] blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                            <img
                                src="https://www.freeiconspng.com/uploads/airplane-icon-image-gallery-1.png"
                                alt="SkyBooking Plane"
                                className="relative rounded-[20px] border border-white/10 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500 size-25"
                            />
                        </div>
                    </div>

                    {/* Search Section Overlay */}
                    <div className="mt-16 lg:-mb-16">
                        <FlightSearch />
                    </div>
                </div>
            </section>

            {/* Popular Destinations Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-primary-600/10 px-4 py-1.5 rounded-full border border-primary-500/20">
                                <Plane size={14} className="text-primary-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-primary-300">Destinations</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold">Popular <span className="text-gradient">Destinations</span></h2>
                            <p className="text-slate-400 max-w-lg">
                                Explore our most booked airports and start your next premium adventure today.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/airports')}
                            className="text-primary-400 font-bold flex items-center gap-2 hover:text-white transition-colors group"
                        >
                            View All Airports <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                    {isLoadingAirports ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={48} className="animate-spin text-primary-500 opacity-20" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredAirports.map(airport => (
                                <AirportCard
                                    key={airport.id}
                                    airport={airport}
                                    onClick={() => {/* Navigate to search with this destination */ }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 bg-slate-950/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl font-bold text-gradient">Why Choose SkyBooking?</h2>
                        <p className="text-slate-400 text-lg">We provide the best experience for your journey.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, title: 'Secure Booking', desc: 'Enterprise-grade security for all your transactions.' },
                            { icon: Clock, title: 'Real-time Updates', desc: 'Get instant notifications about your flight status.' },
                            { icon: Award, title: 'Premium Service', desc: 'World-class amenities and dedicated support.' },
                            { icon: Plane, title: 'Global Reach', desc: 'Over 5,000 destinations across the globe.' },
                        ].map((feature, idx) => (
                            <div key={idx} className="glass-card p-8 rounded-3xl hover:border-primary-500/50 transition-all duration-300 group">
                                <div className="bg-primary-600/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                                    <feature.icon className="text-primary-500 group-hover:text-white transition-colors" size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
