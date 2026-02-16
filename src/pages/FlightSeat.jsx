import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plane, ChevronRight, ShoppingBag, ShieldCheck, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import useBookingStore from '../store/useBookingStore';
import { usePricing } from '../hooks/usePricing';
import SeatMap from '../components/SeatMap';
import api from '../services/api';

const FlightSeat = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Using individual selectors for better reliability
    const {
        selectedFlight,
        selectedClass,
        selectedSeats,
        setSelectedSeats
    } = useBookingStore();
    const { subtotal, tax, total } = usePricing();

    const [loading, setLoading] = useState(true);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            navigate('/all-flights');
            return;
        }

        const fetchSeats = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/flights/${id}`);
                const rawData = response.data;
                const success = rawData.success || (rawData.status === 'success');
                const f = rawData.data?.flight || (rawData.data?.id ? rawData.data : (rawData.flight || rawData.data || rawData));

                if (success && f) {
                    // Deep Seat Hunter (Recursive Search)
                    const huntSeats = (obj, depth = 0) => {
                        if (!obj || typeof obj !== 'object' || depth > 5) return null;

                        // Check common array properties
                        const target = obj.seats || obj.flight_seats || obj.data?.seats;
                        if (Array.isArray(target) && target.length > 0) return target;

                        // Check segments specifically
                        if (Array.isArray(obj.segments)) {
                            const segSeats = obj.segments.flatMap(s => s.seats || s.flight_seats || []);
                            if (segSeats.length > 0) return segSeats;
                        }

                        // Recursive dive
                        for (const key in obj) {
                            if (obj[key] && typeof obj[key] === 'object' && key !== 'f') {
                                const found = huntSeats(obj[key], depth + 1);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    const apiSeats = huntSeats(rawData) || huntSeats(f) || [];

                    if (apiSeats.length > 0) {
                        console.log(`FlightSeat: Manifest secured. Found ${apiSeats.length} active seat slots.`);
                    } else {
                        console.error('FlightSeat: CRITICAL - Manifest empty. Available keys:', Object.keys(f), Object.keys(rawData));
                        console.warn('FlightSeat: Full Body Snapshot:', JSON.stringify(rawData).substring(0, 500));
                    }

                    const segments = f.segments || [];
                    const sortedSegments = [...segments].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

                    const departure = sortedSegments[0] || {};
                    const arrival = sortedSegments[sortedSegments.length - 1] || {};

                    const classes = f.classes || [];

                    const mapped = {
                        ...f,
                        airlineName: f.airline?.name || f.airline_name || 'Unknown Airline',
                        airlineLogo: f.airline?.logo || f.airline_logo,
                        departureTime: f.departure_time || departure.time || '--:--',
                        arrivalTime: f.arrival_time || arrival.time || '--:--',
                        originCity: departure.airport?.city || f.origin_city || 'Unknown',
                        originCode: departure.airport?.code || departure.airport?.iata_code || f.origin_airport_code || '---',
                        destCity: arrival.airport?.city || f.destination_city || 'Unknown',
                        destCode: arrival.airport?.code || arrival.airport?.iata_code || f.destination_airport_code || '---',
                        duration: f.duration || '2h 30m',
                        seats: apiSeats, // Explicitly preserve seats for PassengerDetail mapping
                        mappedClasses: classes.map(c => ({
                            id: c.id,
                            type: c.class_type,
                            price: parseInt(c.price),
                            total_seats: parseInt(c.total_seats || 0),
                            benefits: c.facilities?.map(fac => typeof fac === 'object' ? fac.name : fac) || ['Standard Benefits']
                        }))
                    };

                    // Update the global store with the mapped flight data
                    useBookingStore.getState().setSelectedFlight(mapped);

                    // Sync Selected Class metadata (ensure total_seats is fresh)
                    const currentClassId = useBookingStore.getState().selectedClass?.id;
                    if (currentClassId) {
                        const freshClass = mapped.mappedClasses.find(c => c.id === currentClassId);
                        if (freshClass) {
                            useBookingStore.getState().setSelectedClass(freshClass);
                        }
                    }

                    setBookedSeats(apiSeats.filter(s => !s.is_available).map(s => s.name));
                } else {
                    setError('Unable to fetch aircraft seat map.');
                }
            } catch (error) {
                console.error('Error fetching seat availability:', error);
                setError('Network error while loading cabin configuration.');
            } finally {
                setLoading(false);
            }
        };

        fetchSeats();
    }, [id, navigate]);

    const toggleSeat = (seatName) => {
        const nextSeats = selectedSeats.includes(seatName)
            ? selectedSeats.filter(s => s !== seatName)
            : [...selectedSeats, seatName];
        setSelectedSeats(nextSeats);
    };

    const handleConfirm = () => {
        if (selectedSeats.length > 0) {
            navigate('/passenger-detail'); // Unified route name from App.jsx
        }
    };

    useEffect(() => {
        if (!loading && !selectedFlight) {
            // If lost state on refresh, might need to re-fetch flight details but usually
            // the fetchSeats already handles the base synchronization.
        }
    }, [loading, selectedFlight, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                <p className="mt-6 text-slate-400 font-black text-xl animate-pulse uppercase tracking-[0.2em]">Configuring Aircraft Cabin...</p>
            </div>
        );
    }

    if (error || !selectedFlight || !selectedClass) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
                <AlertCircle size={64} className="text-red-400" />
                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{error || 'Session synchronization failed'}</h2>
                <button onClick={() => navigate(`/flight-class/${id}`)} className="btn-premium px-8 py-3">Resolve in Class Selection</button>
            </div>
        );
    }

    const generateSeats = () => {
        const isBusiness = selectedClass?.type?.toLowerCase().includes('business');
        const colsCount = isBusiness ? 4 : 6;
        const totalSeatsGoal = selectedClass?.total_seats || 54; // Fallback to standard 9 rows
        const rowsCount = Math.ceil(totalSeatsGoal / colsCount);

        const generated = [];
        let seatsCount = 0;

        // Try to find matching seats from flight data to get real IDs
        const flightSeats = selectedFlight.seats || [];

        for (let r = 1; r <= rowsCount; r++) {
            for (let c = 1; c <= colsCount; c++) {
                if (seatsCount >= totalSeatsGoal) break;

                const colLetter = String.fromCharCode(64 + c);
                const seatName = `${r}${colLetter}`;

                // Find real seat object from backend data
                const realSeat = flightSeats.find(s => s.name === seatName);

                generated.push({
                    id: realSeat?.id || `${r}-${c}`,
                    name: seatName,
                    row: r,
                    column: c,
                    is_available: !bookedSeats.includes(seatName) && (realSeat ? realSeat.is_available : true)
                });
                seatsCount++;
            }
        }
        return generated;
    };

    const availableSeats = generateSeats();

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <div className="pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950/20"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Return to Comfort Class</span>
                    </button>

                    <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                                <span className="bg-primary-500/20 px-3 py-1 rounded-full border border-primary-500/20 text-primary-300">Step 03</span>
                                Seat Assignment
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">Choose Your <br /><span className="text-gradient">Strategic Post</span></h1>
                            <p className="text-slate-400 font-bold max-w-xl leading-relaxed text-sm md:text-base uppercase tracking-wider">
                                Experience personalized comfort. Select your preferred {selectedClass?.type} seats from our interactive cabin map.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                <div className="flex flex-col xl:flex-row gap-10">
                    {/* Seat Map Area */}
                    <div className="flex-grow">
                        <div className="glass-card p-10 md:p-16 rounded-[64px] border border-white/5 relative overflow-hidden flex flex-col items-center">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                            <div className="w-full max-w-2xl">
                                <h3 className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-12">Flight Deck Direction</h3>
                                <SeatMap
                                    seats={availableSeats}
                                    selectedSeats={selectedSeats}
                                    onToggleSeat={toggleSeat}
                                    classType={selectedClass?.type}
                                />
                                <div className="mt-16 text-center">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Entry Door & Galley Area</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="w-full xl:w-[420px]">
                        <div className="glass-card rounded-[48px] border border-white/5 p-10 sticky top-24 overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                            <h3 className="font-black text-white mb-10 flex items-center gap-4 text-2xl tracking-tight relative z-10">
                                <div className="w-12 h-12 bg-primary-950/50 border border-primary-500/20 rounded-2xl flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-primary-400" />
                                </div>
                                Selection Logic
                            </h3>

                            <div className="space-y-8 mb-10 pb-8 border-b border-white/5 relative z-10">
                                <div className="bg-slate-900/50 p-6 rounded-[32px] border border-white/5">
                                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
                                        <div className="w-12 h-12 bg-slate-950 p-2.5 rounded-2xl border border-white/5 flex items-center justify-center">
                                            <img src={selectedFlight.airlineLogo} alt="" className="max-h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Carrier</p>
                                            <span className="text-sm font-black text-white uppercase tracking-tight">{selectedFlight.airlineName}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center px-2">
                                        <div className="text-left">
                                            <h4 className="text-2xl font-black text-white tracking-tighter mb-1">{selectedFlight.originCode}</h4>
                                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{selectedFlight.originCity}</p>
                                        </div>
                                        <Plane className="w-5 h-5 text-primary-500 rotate-90 opacity-50" />
                                        <div className="text-right">
                                            <h4 className="text-2xl font-black text-white tracking-tighter mb-1">{selectedFlight.destCode}</h4>
                                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{selectedFlight.destCity}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 px-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Travel Cabin</span>
                                        <span className="font-black text-primary-400 border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest">{selectedClass?.type}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pt-2">Manifest Slots</span>
                                        <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                                            {selectedSeats.length > 0 ? selectedSeats.sort().map(s => (
                                                <span key={s} className="bg-white text-slate-950 px-3 py-1.5 rounded-xl text-[12px] font-black shadow-lg shadow-white/5">{s}</span>
                                            )) : <span className="text-slate-600 font-black text-[10px] uppercase tracking-widest italic mt-2">No selection locked</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-4 px-2">
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Voyagers</span>
                                        <span className="text-sm font-black text-slate-300">{selectedSeats.length} Pax</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Base Rate (Avg)</span>
                                        <span className="text-sm font-black text-slate-300">IDR {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Service Surcharge (10%)</span>
                                        <span className="text-sm font-black text-slate-300">IDR {tax.toLocaleString()}</span>
                                    </div>

                                    <div className="pt-8 border-t border-white/5">
                                        <div className="flex flex-col gap-2 items-end">
                                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]">Total Investment</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-black text-primary-400">IDR</span>
                                                <span className="text-5xl font-black text-white tracking-tighter text-gradient leading-none">{total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={selectedSeats.length === 0}
                                    onClick={handleConfirm}
                                    className={`btn-premium w-full py-7 rounded-[32px] font-black uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-4 transition-all duration-700
                                        ${selectedSeats.length === 0 ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:scale-[1.02] active:scale-95 shadow-2xl hover:shadow-primary-500/40'}
                                    `}
                                >
                                    Verify Booking
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightSeat;
