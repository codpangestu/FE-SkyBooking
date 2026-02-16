import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plane, ChevronRight, CheckCircle, ShieldCheck, Armchair, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import useBookingStore from '../store/useBookingStore';
import api from '../services/api';

const FlightClass = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Using individual selectors for better reliability and performance
    const selectedFlight = useBookingStore((state) => state.selectedFlight);
    const setSelectedFlight = useBookingStore((state) => state.setSelectedFlight);
    const setSelectedClass = useBookingStore((state) => state.setSelectedClass);

    const [loading, setLoading] = useState(true);
    const [localSelectedClass, setLocalSelectedClass] = useState(null);
    const [error, setError] = useState(null);

    const fetchFlight = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/flights/${id}`);
            const rawData = response.data;
            const success = rawData.success || (rawData.status === 'success');
            const f = rawData.data?.flight || (rawData.data?.id ? rawData.data : (rawData.flight || rawData.data || rawData));

            if (success && f) {
                const segments = f.segments || [];
                const sortedSegments = [...segments].sort((a, b) => a.sequence - b.sequence);

                // Robust resolution for departure and arrival
                const departure = sortedSegments[0] || {
                    time: f.departure_time,
                    airport: { city: f.origin_city, iata_code: f.origin_airport_code, name: f.origin_airport_name }
                };
                const arrival = sortedSegments[sortedSegments.length - 1] || {
                    time: f.arrival_time,
                    airport: { city: f.destination_city, iata_code: f.destination_airport_code, name: f.destination_airport_name }
                };

                const classes = f.classes || [];

                const mappedFlight = {
                    ...f,
                    airlineName: f.airline?.name || f.airline_name || 'Unknown Airline',
                    airlineLogo: f.airline?.logo || f.airline_logo,
                    departureTime: departure.time ? (departure.time.includes('T') ? new Date(departure.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : departure.time) : '--:--',
                    arrivalTime: arrival.time ? (arrival.time.includes('T') ? new Date(arrival.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : arrival.time) : '--:--',
                    originCity: departure.airport?.city || f.origin_city || 'Unknown',
                    originCode: departure.airport?.code || departure.airport?.iata_code || f.origin_airport_code || '---',
                    destCity: arrival.airport?.city || f.destination_city || 'Unknown',
                    destCode: arrival.airport?.code || arrival.airport?.iata_code || f.destination_airport_code || '---',
                    duration: f.duration || '2h 30m',
                    mappedClasses: classes.map(c => ({
                        id: c.id,
                        type: c.class_type,
                        price: parseInt(c.price),
                        total_seats: parseInt(c.total_seats || 0),
                        benefits: c.facilities?.map(fac => typeof fac === 'object' ? fac.name : fac) || ['Standard Benefits'],
                        // Theme colors for dark mode
                        color: c.class_type.toLowerCase().includes('business') ? 'bg-primary-600' : 'bg-emerald-500',
                        accent: c.class_type.toLowerCase().includes('business') ? 'text-primary-400' : 'text-emerald-400',
                        icon: c.class_type.toLowerCase().includes('business') ? 'bg-primary-500/10 text-primary-400' : 'bg-emerald-500/10 text-emerald-400'
                    }))
                };
                setSelectedFlight(mappedFlight);
            } else {
                setError('Flight not found or unavailable.');
            }
        } catch (error) {
            console.error('Error fetching flight:', error);
            setError('Failed to sync flight details.');
        } finally {
            setLoading(false);
        }
    }, [id, setSelectedFlight]);

    useEffect(() => {
        if (!id) {
            navigate('/all-flights');
            return;
        }
        fetchFlight();
    }, [id, fetchFlight, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                <p className="mt-6 text-slate-400 font-black text-xl animate-pulse uppercase tracking-widest">Loading Service Classes...</p>
            </div>
        );
    }

    if (error || !selectedFlight) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
                <AlertCircle size={64} className="text-red-400" />
                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{error || 'Flight Synchronization Failed'}</h2>
                <button onClick={() => navigate(-1)} className="btn-premium px-8 py-3">Go Back</button>
            </div>
        );
    }

    const classes = selectedFlight.mappedClasses || [];

    const handleContinue = () => {
        if (localSelectedClass) {
            setSelectedClass(localSelectedClass); // Store full object for better metadata access
            navigate(`/flight-seat/${id}`, { state: { classType: localSelectedClass.type.toLowerCase().includes('business') ? 'business' : 'economy' } });
        }
    };

    return (
        <div className="min-h-screen">
            {/* Contextual Header */}
            <div className="pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950/30"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px]"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Adjust Flight</span>
                    </button>

                    <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                                <span className="bg-primary-500/20 px-3 py-1 rounded-full border border-primary-500/20 text-primary-300">Step 02</span>
                                Comfort Selection
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">Choose Your <br /><span className="text-gradient">Tier of Comfort</span></h1>
                            <p className="text-slate-400 font-bold max-w-xl leading-relaxed text-sm md:text-base uppercase tracking-wider">
                                Choose the class that fits your journey. From efficient travel to ultra-luxury suites.
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-4 glass-card p-6 rounded-[32px] border border-white/5 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
                            <div className="w-14 h-14 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                                <Plane className="w-8 h-8 text-primary-500 -rotate-45" />
                            </div>
                            <div className="pr-4 relative z-10">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Aviation Partner</p>
                                <p className="text-lg font-black text-white uppercase tracking-tighter leading-none">{selectedFlight.airlineName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-24">
                <div className="flex flex-col xl:flex-row gap-10">
                    {/* Main Selection */}
                    <div className="flex-grow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {classes.map((cls, index) => (
                                <div
                                    key={index}
                                    onClick={() => setLocalSelectedClass(cls)}
                                    className={`group relative glass-card rounded-[48px] border-2 transition-all duration-700 cursor-pointer overflow-hidden p-10 shadow-2xl ${localSelectedClass?.type === cls.type
                                        ? 'border-primary-500 ring-8 ring-primary-500/5 translate-y-[-12px] bg-primary-950/10'
                                        : 'border-white/5 hover:border-white/10 hover:translate-y-[-6px]'
                                        }`}
                                >
                                    {localSelectedClass?.type === cls.type && (
                                        <div className="absolute top-8 right-8 text-primary-500 animate-in zoom-in duration-500">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-primary-500 rounded-full blur-xl opacity-40"></div>
                                                <CheckCircle className="w-12 h-12 fill-primary-600 text-white relative z-10" />
                                            </div>
                                        </div>
                                    )}

                                    <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center mb-10 shadow-2xl transform group-hover:rotate-6 transition-all duration-700 bg-slate-900 border border-white/10 ${localSelectedClass?.type === cls.type ? 'scale-110 border-primary-500/50' : ''}`}>
                                        <Armchair className={`w-10 h-10 ${cls.accent}`} />
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-4xl font-black text-white mb-4 tracking-tighter leading-none">{cls.type}</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Base Fare</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-sm font-black ${cls.accent}`}>IDR</span>
                                                <span className="text-5xl font-black text-white tracking-tighter text-gradient">{cls.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5 mb-12 border-t border-white/5 pt-10">
                                        {cls.benefits.map((benefit, bIdx) => (
                                            <div key={bIdx} className="flex items-center gap-4 text-sm text-slate-400 font-bold group/item">
                                                <div className={`w-2.5 h-2.5 rounded-full ${cls.accent.replace('text', 'bg')} shadow-lg shadow-white/10 group-hover/item:scale-150 transition-transform`}></div>
                                                <span className="group-hover/item:text-white transition-colors uppercase tracking-widest text-[11px]">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLocalSelectedClass(cls);
                                        }}
                                        className={`w-full py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-xs transition-all duration-700 shadow-2xl ${localSelectedClass?.type === cls.type
                                            ? 'btn-premium'
                                            : 'bg-slate-900 border border-white/10 text-white hover:bg-slate-800'
                                            }`}
                                    >
                                        {localSelectedClass?.type === cls.type ? 'Requirement Locked' : 'Select Comfort Tier'}
                                    </button>

                                    <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${cls.type === 'Business Class' ? 'from-primary-600 to-indigo-600' : 'from-emerald-500 to-teal-500'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="w-full xl:w-[420px]">
                        <div className="glass-card rounded-[48px] border border-white/5 p-10 sticky top-24 overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                            <h3 className="font-black text-white mb-10 flex items-center gap-4 text-2xl tracking-tight relative z-10">
                                <div className="w-12 h-12 bg-primary-950/50 border border-primary-500/20 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-primary-400" />
                                </div>
                                Voyage Overview
                            </h3>

                            <div className="space-y-8 mb-10 pb-10 border-b border-white/5 relative z-10">
                                <div className="flex items-center gap-6 bg-slate-900/50 p-6 rounded-[32px] border border-white/5 group-hover:border-primary-500/20 transition-colors">
                                    <div className="w-16 h-16 p-3 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                        <img
                                            src={selectedFlight.airlineLogo}
                                            alt=""
                                            className="max-h-full object-contain filter drop-shadow-lg"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-2">Fleet Provider</p>
                                        <h4 className="text-xl font-black text-white leading-tight tracking-tighter uppercase">{selectedFlight.airlineName}</h4>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-slate-300 bg-slate-900/30 p-8 rounded-[40px] border border-white/5 shadow-inner">
                                    <div className="text-left">
                                        <p className="text-3xl font-black text-white tracking-tighter leading-none mb-3">{selectedFlight.departureTime}</p>
                                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em]">{selectedFlight.originCode}</p>
                                    </div>
                                    <div className="flex-grow flex flex-col items-center gap-2 px-6">
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{selectedFlight.duration}</span>
                                        <div className="w-full relative py-2">
                                            <div className="w-full h-[1px] bg-slate-800 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-2 rounded-full border border-white/10 shadow-lg">
                                                    <Plane className="w-4 h-4 text-primary-500 rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-white tracking-tighter leading-none mb-3">{selectedFlight.arrivalTime}</p>
                                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em]">{selectedFlight.destCode}</p>
                                    </div>
                                </div>
                            </div>

                            {localSelectedClass ? (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 relative z-10">
                                    <div className="flex justify-between items-center bg-primary-600/10 p-6 rounded-[28px] border border-primary-500/20">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2">Confirmed Comfort</span>
                                            <span className="font-black text-white text-2xl tracking-tight uppercase leading-none">{localSelectedClass.type}</span>
                                        </div>
                                        <div className="bg-primary-500 rounded-full p-1.5">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-2 px-1">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Investment for Journey</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-black text-primary-500">IDR</span>
                                            <span className="text-6xl font-black text-white tracking-tighter text-gradient leading-none">{localSelectedClass.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleContinue}
                                        className="btn-premium w-full py-7 rounded-[32px] flex items-center justify-center gap-4 group shadow-primary-500/20 shadow-2xl relative overflow-hidden"
                                    >
                                        <span className="font-black uppercase tracking-[0.3em] text-sm relative z-10">Continue to Seat Map</span>
                                        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-2 relative z-10" />
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-slate-900/50 p-12 rounded-[40px] text-center border-2 border-dashed border-white/5 group-hover:border-primary-500/20 transition-all duration-500">
                                    <div className="bg-slate-950 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-2xl">
                                        <Armchair className="w-10 h-10 text-slate-700 group-hover:text-primary-500/50 transition-colors" />
                                    </div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
                                        Please select a class tier <br /> to finalize your summary.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightClass;
