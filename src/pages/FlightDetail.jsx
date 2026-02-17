import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plane, Clock, Wifi, Coffee, Luggage, ChevronRight, MapPin, ShieldCheck, Calendar, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import useBookingStore from '../store/useBookingStore';

const FlightDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setSelectedFlight } = useBookingStore();
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/flights/${id}`);
                const rawData = response.data;
                const success = rawData.success || (rawData.status === 'success');
                const f = rawData.data?.flight || (rawData.data?.id ? rawData.data : (rawData.flight || rawData.data || rawData));

                if (success && f) {
                    const segments = f.segments || [];
                    const sortedSegments = [...segments].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

                    const departure = sortedSegments[0] || {};
                    const arrival = sortedSegments[sortedSegments.length - 1] || {};

                    const classes = f.classes || f.data?.classes || [];

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
                        basePrice: classes.length > 0 ? Math.min(...classes.map(c => parseInt(c.price) || 0)) : (parseInt(f.base_price) || 0),
                        facilities: classes[0]?.facilities?.map(fac => typeof fac === 'object' ? fac.name : fac) || f.facilities || ['Standard Amenities'],
                        mappedClasses: classes.map(c => ({
                            id: c.id,
                            type: c.class_type,
                            price: parseInt(c.price),
                            benefits: c.facilities?.map(fac => typeof fac === 'object' ? fac.name : fac) || ['Standard Benefits']
                        }))
                    };
                    setFlight(mapped);
                    setSelectedFlight(mapped);
                } else {
                    console.error('Flight fetch failed:', rawData);
                    navigate('/all-flights');
                }
            } catch (error) {
                console.error('Error fetching flight details:', error);
                navigate('/all-flights');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchFlight();
    }, [id, navigate, setSelectedFlight]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                <p className="mt-6 text-slate-400 font-black text-xl animate-pulse">Loading Flight Specifications...</p>
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
                <AlertCircle size={64} className="text-red-400" />
                <h2 className="text-2xl font-bold text-white">Flight Not Found</h2>
                <button onClick={() => navigate(-1)} className="btn-premium px-8 py-3">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header Hero */}
            <div className="pt-24 pb-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-primary-900/20 to-slate-950 opacity-80"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Back to Results</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                                <span className="bg-primary-500/20 px-3 py-1 rounded-full border border-primary-500/20 text-primary-300">Selected Voyage</span>
                                <span className="text-slate-500">Flight Details</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">
                                {flight.originCode} <Plane className="inline-block w-8 h-8 md:w-12 md:h-12 mx-4 text-primary-500 rotate-90" /> {flight.destCode}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-400">
                                <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-white/5">
                                    <Calendar className="w-4 h-4 text-primary-400" />
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </span>
                                <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-white/5">
                                    <Clock className="w-4 h-4 text-primary-400" />
                                    {flight.duration} Duration
                                </span>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-[32px] border border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-2 relative z-10">Starting From</p>
                            <div className="flex items-baseline gap-2 relative z-10">
                                <span className="text-lg font-black text-white/30">IDR</span>
                                <span className="text-5xl font-black text-white text-gradient">
                                    {parseInt(flight.basePrice || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Info Card */}
                        <div className="glass-card p-10 rounded-[48px] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                            <div className="flex items-center gap-6 mb-12 pb-8 border-b border-white/5">
                                <div className="w-20 h-20 bg-slate-900/50 p-4 rounded-3xl border border-white/10 flex items-center justify-center">
                                    <img src={flight.airlineLogo} alt={flight.airlineName} className="max-h-full object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">{flight.airlineName}</h2>
                                    <p className="text-xs font-black text-primary-400 uppercase tracking-[0.2em]">{flight.flight_number}</p>
                                </div>
                            </div>

                            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

  {/* Timeline divider (desktop only) */}
  <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-[1px] bg-gradient-to-b from-transparent via-primary-500/30 to-transparent -translate-x-1/2"></div>

  {/* Departure */}
  <div className="flex-1 text-center md:text-left space-y-3">
    <p className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl font-black tracking-tight">
      {flight.departureTime}
    </p>
    <p className="font-black text-primary-500 uppercase tracking-[0.2em] text-xs md:text-sm">
      {flight.originCode}
    </p>
    <div className="space-y-1">
      <p className="text-slate-300 font-bold text-base md:text-lg leading-tight">
        {flight.originCity}
      </p>
      <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-widest">
        {flight.origin_airport_name || 'International Terminal'}
      </p>
    </div>
  </div>

  {/* Center plane */}
  <div className="flex flex-col items-center justify-center gap-4 md:w-20">
    <div className="w-12 h-12 rounded-full bg-slate-900/50 flex items-center justify-center border border-white/10 shadow-lg">
      <Plane className="w-6 h-6 text-primary-500 rotate-90" />
    </div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
      {flight.duration}
    </span>
  </div>

  {/* Arrival */}
  <div className="flex-1 text-center md:text-right space-y-3">
    <p className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl 2xl:text-6xl font-black tracking-tight">
      {flight.arrivalTime}
    </p>
    <p className="font-black text-primary-500 uppercase tracking-[0.2em] text-xs md:text-sm">
      {flight.destCode}
    </p>
    <div className="space-y-1">
      <p className="text-slate-300 font-bold text-base md:text-lg leading-tight">
        {flight.destCity}
      </p>
      <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-widest">
        {flight.destination_airport_name || 'Gate A-24 Main Hall'}
      </p>
    </div>
  </div>

</div>

                        </div>

                        {/* Amenities Card */}
                        <div className="glass-card p-10 rounded-[48px] border border-white/5">
                            <h3 className="text-xl font-black text-white mb-10 uppercase tracking-tighter flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-primary-400" />
                                High-End On-Board Facilities
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                {(flight.facilities || []).map((fac, idx) => {
                                    const facName = typeof fac === 'object' ? fac.name : fac;
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-4 p-6 bg-slate-900/50 rounded-[32px] border border-white/5 group hover:border-primary-500/50 transition-all duration-500">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-primary-400 shadow-inner border border-white/5 group-hover:scale-110 group-hover:text-white group-hover:bg-primary-600/20 transition-all">
                                                {facName.toLowerCase().includes('wifi') ? <Wifi className="w-6 h-6" /> :
                                                    facName.toLowerCase().includes('meal') ? <Coffee className="w-6 h-6" /> :
                                                        <Luggage className="w-6 h-6" />}
                                            </div>
                                            <p className="text-[10px] font-black text-slate-500 group-hover:text-primary-300 uppercase tracking-widest text-center">{facName}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="glass-card p-10 rounded-[48px] border border-white/5 sticky top-24 shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter">Ready to Voyage?</h3>

                            <div className="space-y-6 mb-10">
                                <div className="p-8 bg-slate-900/50 rounded-[32px] border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <div className="flex justify-between items-center mb-6 relative z-10">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Fare</span>
                                        <span className="font-black text-white">IDR {parseInt(flight.basePrice || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-primary-400 font-black text-[10px] uppercase tracking-widest pt-4 border-t border-white/5 relative z-10">
                                        <span>Full Insurance</span>
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="flex gap-3 px-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>
                                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tighter">
                                        Final price will be calculated based on your selected travel class and specific seat choice in the next steps.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/flight-class/${flight.id}`)}
                                className="btn-premium w-full py-6 rounded-[28px] text-sm flex items-center justify-center gap-4 group"
                            >
                                <span className="font-black uppercase tracking-[0.2em]">Select Flight Class</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightDetail;
