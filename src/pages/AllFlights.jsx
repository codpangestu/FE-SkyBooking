import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plane, Wifi, Filter, ChevronRight, Search, Layout, Calendar, User } from 'lucide-react';
import api from '../services/api'; // Corrected from ../utils/api
import useBookingStore from '../store/useBookingStore';
import FlightCard from '../components/FlightCard';

const AllFlights = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { searchFilter, airports, setAirports, setSelectedFlight } = useBookingStore();

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('price_low');
    const [filters, setFilters] = useState({
        type: [],
        airlines: [],
        facilities: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('AllFlights: Fetching data started...');

                // 1. Fetch Airports if not exists in store
                let currentAirports = airports;
                if (currentAirports.length === 0) {
                    console.log('AllFlights: No airports in store, fetching from API...');
                    const airportRes = await api.get('/airports');
                    // Check if response has success or directly returns data
                    const airportData = airportRes.data.success ? airportRes.data.data : (Array.isArray(airportRes.data) ? airportRes.data : airportRes.data.data);

                    if (airportData) {
                        currentAirports = airportData;
                        console.log('AllFlights: Airports fetched successfully:', currentAirports.length);
                        setAirports(currentAirports);
                    } else {
                        console.warn('AllFlights: Failed to fetch airports:', airportRes.data.message);
                    }
                }

                // 2. Fetch Flights with resolved IDs from searchFilter
                const params = {};
                console.log('AllFlights: Current searchFilter:', searchFilter);

                if (searchFilter.origin) {
                    const originAirport = currentAirports.find(a => {
                        const airportCode = a.code || a.iata || a.iata_code || a.airport_code;
                        return (
                            a.city?.toLowerCase() === searchFilter.origin.toLowerCase() ||
                            airportCode?.toLowerCase() === searchFilter.origin.toLowerCase() ||
                            (airportCode && searchFilter.origin.includes(`(${airportCode})`))
                        );
                    });
                    if (originAirport) {
                        params.departure_airport_id = originAirport.id;
                    } else {
                        console.warn('AllFlights: Could not find origin airport for:', searchFilter.origin);
                    }
                }

                if (searchFilter.destination) {
                    const destAirport = currentAirports.find(a => {
                        const airportCode = a.code || a.iata || a.iata_code || a.airport_code;
                        return (
                            a.city?.toLowerCase() === searchFilter.destination.toLowerCase() ||
                            airportCode?.toLowerCase() === searchFilter.destination.toLowerCase() ||
                            (airportCode && searchFilter.destination.includes(`(${airportCode})`))
                        );
                    });
                    if (destAirport) {
                        params.arrival_airport_id = destAirport.id;
                    } else {
                        console.warn('AllFlights: Could not find destination airport for:', searchFilter.destination);
                    }
                }

                if (searchFilter.date) {
                    params.date = searchFilter.date;
                }

                console.log('AllFlights: Requesting flights with params:', params);
                const response = await api.get('/flights', { params });
                console.log('AllFlights: API Response:', response.data);

                const rawData = response.data;
                const flightData = rawData.success ? rawData.data.data || rawData.data : (Array.isArray(rawData) ? rawData : rawData.data);

                console.log('AllFlights: Flights received:', flightData?.length);
                setFlights(Array.isArray(flightData) ? flightData : []);
            } catch (error) {
                console.error('AllFlights: Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchFilter.origin, searchFilter.destination, searchFilter.date, airports.length, setAirports]);

    const toggleFilter = (category, value) => {
        setFilters(prev => {
            const current = prev[category];
            const next = current.includes(value)
                ? current.filter(i => i !== value)
                : [...current, value];
            return { ...prev, [category]: next };
        });
    };

    const processedFlights = useMemo(() => {
        if (!Array.isArray(flights)) return [];

        return flights.map(f => {
            const segments = f.segments || [];
            // Handle both structure: segments with sequence or flat segments
            const departure = segments.find(s => s.sequence === 1) || segments[0] || {};
            const arrival = [...segments].sort((a, b) => (b.sequence || 0) - (a.sequence || 0))[0] || segments[segments.length - 1] || {};

            const classes = f.classes || [];
            const minPrice = classes.length > 0 ? Math.min(...classes.map(c => c.price)) : (f.base_price || 0);
            const allFacilities = [...new Set(classes.flatMap(c => c.facilities?.map(fac => typeof fac === 'object' ? fac.name : fac) || []))];

            return {
                ...f,
                airlineName: f.airline?.name || f.airline_name || 'Unknown Airline',
                airlineLogo: f.airline?.logo || f.airline_logo,
                departureTime: f.departure_time || (departure.departure_time || departure.time ? new Date(departure.departure_time || departure.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'),
                arrivalTime: f.arrival_time || (arrival.arrival_time || arrival.time ? new Date(arrival.arrival_time || arrival.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'),
                originCity: departure.airport?.city || f.origin_airport_city || 'Unknown',
                originCode: departure.airport?.code || departure.airport?.iata_code || f.origin_airport_code || '---',
                destCity: arrival.airport?.city || f.destination_airport_city || 'Unknown',
                destCode: arrival.airport?.code || arrival.airport?.iata_code || f.destination_airport_code || '---',
                price: minPrice,
                facilities: allFacilities,
                type: segments.length > 1 ? `${segments.length - 1} Transit` : 'Direct',
                duration: f.duration || '2h 30m'
            };
        });
    }, [flights]);

    const availableAmenities = useMemo(() => {
        const allUniqueFacs = [...new Set(processedFlights.flatMap(f => f.facilities || []))];
        return allUniqueFacs.sort();
    }, [processedFlights]);

    const filteredFlights = useMemo(() => {
        let result = [...processedFlights];

        if (filters.type.length > 0) result = result.filter(f => filters.type.includes(f.type));
        if (filters.airlines.length > 0) result = result.filter(f => filters.airlines.includes(f.airlineName));
        if (filters.facilities.length > 0) {
            result = result.filter(f => filters.facilities.every(fac => f.facilities.includes(fac)));
        }

        if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'duration_fast') {
            const parseD = (d) => {
                const parts = d.match(/(\d+)h\s*(\d+)m/);
                return parts ? parseInt(parts[1]) * 60 + parseInt(parts[2]) : 0;
            };
            result.sort((a, b) => parseD(a.duration) - parseD(b.duration));
        }

        return result;
    }, [processedFlights, filters, sortBy]);

    const handleSelectFlight = (flight) => {
        setSelectedFlight(flight);
        navigate(`/flight-detail/${flight.id}`); // Fixed path to match project
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center space-y-6 min-h-screen">
                <div className="w-16 h-16 border-8 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="text-center">
                    <h3 className="text-xl font-black text-white">Finding Best Flights...</h3>
                    <p className="text-slate-400 font-bold">Searching routes for your journey</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-900 via-slate-900 to-secondary-900 pt-16 pb-28 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                {/* Animated Background Elements */}
                <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 lg:pt-10">
                    <div className="flex items-center gap-8">
                        <div className="glass p-5 rounded-[32px] border border-white/20 shadow-2xl rotate-12">
                            <Plane className="w-12 h-12 rotate-90 text-primary-400" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-4 text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                <span className="text-gradient leading-tight">{searchFilter.origin || 'Origin'}</span>
                                <ChevronRight className="w-6 h-6 text-slate-500" />
                                <span className="text-gradient leading-tight">{searchFilter.destination || 'Destination'}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="flex items-center gap-2 glass px-5 py-2 rounded-2xl text-xs font-bold tracking-widest border border-white/5 uppercase">
                                    <Calendar className="w-4 h-4 text-primary-400" /> {searchFilter.date || 'Anytime'}
                                </span>
                                <span className="flex items-center gap-2 glass px-5 py-2 rounded-2xl text-xs font-bold tracking-widest border border-white/5 uppercase">
                                    <User className="w-4 h-4 text-primary-400" /> {searchFilter.passengers} Traveler
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="btn-premium px-8 py-4">
                        Modify Journey
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20 flex flex-col lg:flex-row gap-10 pb-24">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-[320px] space-y-8">
                    <div className="glass-card p-8 rounded-[40px] space-y-8">
                        <div className="flex items-center gap-4 border-b border-slate-700 pb-6">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
                                <Filter className="w-6 h-6 text-primary-400" />
                            </div>
                            <h3 className="font-bold text-white text-xl">Refine Results</h3>
                        </div>

                        {/* Transit Filter */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Layout className="w-4 h-4" />
                                Journey Type
                            </h4>
                            <div className="space-y-3">
                                {['Direct', '1 Transit', '2 Transit'].map(type => (
                                    <label key={type} className="flex items-center gap-4 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500"
                                            onChange={() => toggleFilter('type', type)}
                                            checked={filters.type.includes(type)}
                                        />
                                        <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Airlines Filter */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Plane className="w-4 h-4" />
                                Carriers
                            </h4>
                            <div className="space-y-3">
                                {[...new Set(processedFlights.map(f => f.airlineName))].map(airline => (
                                    <label key={airline} className="flex items-center gap-4 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500"
                                            onChange={() => toggleFilter('airlines', airline)}
                                            checked={filters.airlines.includes(airline)}
                                        />
                                        <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors uppercase tracking-tight">{airline}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Experience Filter */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Wifi className="w-4 h-4" />
                                Amenities
                            </h4>
                            <div className="space-y-3">
                                {availableAmenities.map(fac => (
                                    <label key={fac} className="flex items-center gap-4 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary-500 focus:ring-primary-500"
                                            onChange={() => toggleFilter('facilities', fac)}
                                            checked={filters.facilities.includes(fac)}
                                        />
                                        <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors capitalize">{fac}</span>
                                    </label>
                                ))}
                                {processedFlights.length > 0 && availableAmenities.length === 0 && (
                                    <p className="text-[10px] text-slate-600 italic">No amenities info available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main List */}
                <main className="flex-grow space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 glass-card p-4 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Showing</span>
                            <span className="text-gradient font-bold text-lg">
                                {filteredFlights.length} Flights
                            </span>
                        </div>
                        <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl">
                            {['price_low', 'duration_fast'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSortBy(opt)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${sortBy === opt ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {opt === 'price_low' ? 'Cheapest' : 'Fastest'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredFlights.length === 0 ? (
                            <div className="glass-card p-24 text-center rounded-[40px]">
                                <Search className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-2">No Flights Found</h3>
                                <p className="text-slate-500 font-medium mb-8">Try adjusting your filters or search parameters.</p>
                                <button onClick={() => setFilters({ type: [], airlines: [], facilities: [] })} className="text-primary-400 font-bold hover:text-white transition-colors">Clear All Filters</button>
                            </div>
                        ) : (
                            filteredFlights.map(flight => (
                                <FlightCard
                                    key={flight.id}
                                    flight={flight}
                                    onSelect={handleSelectFlight}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AllFlights;

