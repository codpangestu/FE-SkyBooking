import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Search, MapPin, Loader2, ArrowLeft, ChevronRight } from 'lucide-react';
import flightService from '../services/flightService';
import AirportCard from '../components/AirportCard';
import useBookingStore from '../store/useBookingStore';

const Airports = () => {
    const navigate = useNavigate();
    const { airports, setAirports, setSearchFilter } = useBookingStore();
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAirports = async () => {
            if (airports.length > 0) return;
            setIsLoading(true);
            try {
                const data = await flightService.getAirports();
                const list = Array.isArray(data) ? data : data?.data;
                setAirports(Array.isArray(list) ? list : []);
            } catch (error) {
                console.error('Failed to fetch airports:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAirports();
    }, [airports.length, setAirports]);

    const filteredAirports = useMemo(() => {
        if (!searchQuery) return airports;
        const query = searchQuery.toLowerCase();
        return airports.filter(airport => {
            const airportCode = airport.code || airport.iata || airport.iata_code || airport.airport_code;
            return (
                airport.name?.toLowerCase().includes(query) ||
                airport.city?.toLowerCase().includes(query) ||
                airportCode?.toLowerCase().includes(query)
            );
        });
    }, [airports, searchQuery]);

    const handleAirportClick = (airport) => {
        const airportCode = airport.code || airport.iata || airport.iata_code || airport.airport_code;
        setSearchFilter({ destination: `${airport.city} (${airportCode})` });
        navigate('/all-flights');
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors font-bold group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            Explore <span className="text-gradient">Airports</span>
                        </h1>
                        <p className="text-slate-400 max-w-xl">
                            Discover all available destinations and start planning your next journey across our global network of premium airports.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-0 bg-primary-500/10 rounded-2xl blur-xl group-focus-within:bg-primary-500/20 transition-all"></div>
                        <div className="relative glass-card flex items-center px-4 rounded-2xl border-white/10 group-focus-within:border-primary-500/50 transition-all">
                            <Search className="text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, city, or code..."
                                className="w-full bg-transparent border-none py-4 px-4 outline-none text-white placeholder-slate-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-4">
                        <Loader2 size={64} className="animate-spin text-primary-500 opacity-20" />
                        <p className="text-slate-500 font-bold animate-pulse">Loading Airports...</p>
                    </div>
                ) : (
                    <>
                        {filteredAirports.length === 0 ? (
                            <div className="glass-card p-20 rounded-[40px] text-center border-white/5 animate-in fade-in zoom-in duration-500">
                                <MapPin size={64} className="mx-auto text-slate-700 mb-6" />
                                <h3 className="text-2xl font-bold mb-2">No Airports Found</h3>
                                <p className="text-slate-500">We couldn't find any airports matching "{searchQuery}"</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-8 text-primary-400 font-bold hover:text-white transition-colors"
                                >
                                    Clear Search
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {filteredAirports.map((airport, idx) => (
                                    <div
                                        key={airport.id}
                                        className="animate-in fade-in slide-in-from-bottom-8 duration-500"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <AirportCard
                                            airport={airport}
                                            onClick={() => handleAirportClick(airport)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Airports;
