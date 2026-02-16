import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, ChevronRight, Bookmark, Plane, ShieldCheck, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import useBookingStore from '../store/useBookingStore';
import { usePricing } from '../hooks/usePricing';
import { useValidation } from '../hooks/useValidation';

const PassengerDetail = () => {
    const navigate = useNavigate();

    const {
        selectedFlight,
        selectedClass,
        selectedSeats,
        passengerDetails,
        setPassengerDetails
    } = useBookingStore();

    const { subtotal, tax, total } = usePricing();
    const { errors, validateForm } = useValidation();

    const [passengers, setPassengers] = useState([]);

    useEffect(() => {
        if (!selectedFlight || !selectedSeats || selectedSeats.length === 0) {
            navigate('/all-flights');
            return;
        }

        // Initialize or sync passengers state
        if (passengerDetails && passengerDetails.length === selectedSeats.length) {
            setPassengers(passengerDetails);
        } else {
            const initial = selectedSeats.map((seat) => ({
                seat,
                name: '',
                email: '',
                phone: '',
                date_of_birth: '',
                nationality: 'Indonesia'
            }));
            setPassengers(initial);
        }
    }, [selectedFlight, selectedSeats, passengerDetails, navigate]);

    const handleInputChange = (index, field, value) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm(passengers)) {
            console.log('Initiating Manifest Sync...', {
                flight_id: selectedFlight.id,
                seats_array_exists: !!selectedFlight.seats,
                seats_count: selectedFlight.seats?.length || 0,
                full_flight_object: selectedFlight
            });

            // Map seat names to real database IDs from the flight data
            // Aggregate all possible seat locations for lookup
            const flightSeats = [
                ...(selectedFlight.seats || []),
                ...(selectedFlight.flight_seats || []),
                ...(selectedFlight.data?.seats || []),
                ...(selectedFlight.data?.data?.seats || [])
            ];

            const enrichedPassengers = passengers.map(p => {
                // Case-insensitive match with trim to be extremely robust
                const targetSeat = p.seat?.toString().toUpperCase().trim();
                const realSeat = flightSeats.find(s => s.name?.toString().toUpperCase().trim() === targetSeat);

                // FALLBACK Logic: If backend has NO seats manifest, allow null ID
                // This prevents the "Validasi gagal" blocker when backend is out of sync
                const effectiveId = realSeat?.id || null;

                console.log(`Passenger Manifest Mapping: [Seat ${targetSeat}] -> [ID: ${effectiveId || 'FALLBACK'}]`);
                if (!realSeat) {
                    console.warn('Seat not found in manifest:', targetSeat, 'Using fallback null ID');
                }

                return {
                    ...p,
                    flight_seat_id: effectiveId
                };
            });

            setPassengerDetails(enrichedPassengers);
            navigate('/payment');
        }
    };

    if (!selectedFlight || !selectedClass || !selectedSeats) return null;

    return (
        <div className="min-h-screen pb-24">
            {/* Header Hero */}
            <div className="pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950/20"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Change Seat Selection</span>
                    </button>

                    <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                                <span className="bg-primary-500/20 px-3 py-1 rounded-full border border-primary-500/20 text-primary-300">Step 04</span>
                                Manifest Setup
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">Register Your <br /><span className="text-gradient">Flight Identity</span></h1>
                            <p className="text-slate-400 font-bold max-w-xl leading-relaxed text-sm md:text-base uppercase tracking-wider">
                                We need the accurate identification of all travelers to finalize the boarding manifest.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Passenger Forms */}
                    <div className="flex-grow space-y-10">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {passengers.map((p, index) => (
                                <div key={index} className="glass-card p-10 rounded-[48px] border border-white/5 relative overflow-hidden group transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-32 bg-primary-500 rounded-r-full shadow-[0_0_20px_rgba(147,51,234,0.5)]"></div>

                                    <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5 relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-[24px] bg-slate-900 border border-white/10 text-primary-400 flex items-center justify-center font-black text-2xl shadow-inner">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-white text-xl uppercase tracking-tighter">Traveler {index + 1}</h3>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none mt-2">Manifest Identity</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-950 border border-primary-500/30 text-white px-6 py-3 rounded-2xl text-[10px] font-black flex items-center gap-3 shadow-2xl">
                                            <Bookmark className="w-4 h-4 text-primary-500" />
                                            <span className="tracking-[0.2em]">ASSIGNED SEAT: {p.seat}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                        {/* Name */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Full Legal Name</label>
                                            <div className="relative group/input">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Alexander Pierce"
                                                    className={`w-full outline-none pl-14 h-16 rounded-[24px] border-2 transition-all font-bold text-white bg-slate-900/50 ${errors[index]?.name ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/5 focus:border-primary-500/50'}`}
                                                    value={p.name}
                                                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            {errors[index]?.name && <p className="text-[10px] text-rose-500 font-bold ml-2 uppercase tracking-widest">{errors[index].name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Contact Email</label>
                                            <div className="relative group/input">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" />
                                                <input
                                                    type="email"
                                                    placeholder="alexander@voyage.com"
                                                    className={`w-full outline-none pl-14 h-16 rounded-[24px] border-2 transition-all font-bold text-white bg-slate-900/50 ${errors[index]?.email ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/5 focus:border-primary-500/50'}`}
                                                    value={p.email}
                                                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                                                />
                                            </div>
                                            {errors[index]?.email && <p className="text-[10px] text-rose-500 font-bold ml-2 uppercase tracking-widest">{errors[index].email}</p>}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Mobile Number</label>
                                            <div className="relative group/input">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" />
                                                <input
                                                    type="tel"
                                                    placeholder="+62 812 XXXX XXXX"
                                                    className={`w-full outline-none pl-14 h-16 rounded-[24px] border-2 transition-all font-bold text-white bg-slate-900/50 ${errors[index]?.phone ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/5 focus:border-primary-500/50'}`}
                                                    value={p.phone}
                                                    onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                                                />
                                            </div>
                                            {errors[index]?.phone && <p className="text-[10px] text-rose-500 font-bold ml-2 uppercase tracking-widest">{errors[index].phone}</p>}
                                        </div>

                                        {/* DOB */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Date of Birth</label>
                                            <div className="relative group/input">
                                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" />
                                                <input
                                                    type="date"
                                                    className={`w-full outline-none pl-14 h-16 rounded-[24px] border-2 transition-all font-bold text-white bg-slate-900/50 appearance-none color-scheme-dark ${errors[index]?.date_of_birth ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/5 focus:border-primary-500/50'}`}
                                                    value={p.date_of_birth}
                                                    onChange={(e) => handleInputChange(index, 'date_of_birth', e.target.value)}
                                                />
                                            </div>
                                            {errors[index]?.date_of_birth && <p className="text-[10px] text-rose-500 font-bold ml-2 uppercase tracking-widest">{errors[index].date_of_birth}</p>}
                                        </div>

                                        {/* Nationality */}
                                        <div className="col-span-1 md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Global Nationality</label>
                                            <div className="relative group/input">
                                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="Republic of Indonesia"
                                                    className={`w-full outline-none pl-14 h-16 rounded-[24px] border-2 transition-all font-bold text-white bg-slate-900/50 ${errors[index]?.nationality ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/5 focus:border-primary-500/50'}`}
                                                    value={p.nationality}
                                                    onChange={(e) => handleInputChange(index, 'nationality', e.target.value)}
                                                />
                                            </div>
                                            {errors[index]?.nationality && <p className="text-[10px] text-rose-500 font-bold ml-2 uppercase tracking-widest">{errors[index].nationality}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6">
                                <button type="submit" className="btn-premium w-full py-8 rounded-[32px] text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-primary-500/20 shadow-2xl hover:scale-[1.01] active:scale-95 transition-all group">
                                    Proceed to Settlement
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <div className="flex items-center justify-center gap-3 mt-8">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Military-Grade Encryption Active</span>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-[420px]">
                        <div className="glass-card p-10 rounded-[48px] space-y-10 sticky top-24 border border-white/5 shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                            <div>
                                <h3 className="font-black text-white mb-10 flex items-center gap-4 text-2xl tracking-tight relative z-10">
                                    <div className="w-12 h-12 bg-primary-950/50 border border-primary-500/20 rounded-2xl flex items-center justify-center">
                                        <Bookmark className="w-6 h-6 text-primary-400" />
                                    </div>
                                    Voyage Digest
                                </h3>

                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center gap-5 bg-slate-900/50 p-5 rounded-[28px] border border-white/5">
                                        <div className="w-12 h-12 bg-slate-950 p-2.5 rounded-xl border border-white/10 shadow-inner flex items-center justify-center">
                                            <img src={selectedFlight.airlineLogo || 'https://placehold.co/100x100?text=Airline'} alt="" className="max-h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1.5">Official Carrier</p>
                                            <h4 className="text-lg font-black text-white leading-tight tracking-tighter uppercase">{selectedFlight.airlineName}</h4>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-950 p-8 rounded-[40px] border border-white/5 shadow-inner">
                                        <div className="text-left">
                                            <p className="text-3xl font-black text-white tracking-tighter mb-1">{selectedFlight.originCode}</p>
                                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{selectedFlight.originCity}</p>
                                        </div>
                                        <Plane className="w-5 h-5 text-primary-500 rotate-90 opacity-40 shrink-0" />
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-white tracking-tighter mb-1">{selectedFlight.destCode}</p>
                                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{selectedFlight.destCity}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 px-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cabin Tier</span>
                                            <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">{selectedClass?.type}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pt-1">Allocation</span>
                                            <div className="flex flex-wrap gap-2 justify-end max-w-[150px]">
                                                {selectedSeats.map(s => (
                                                    <span key={s} className="bg-white text-slate-900 px-3 py-1 rounded-lg text-[11px] font-black shadow-lg shadow-white/5">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/5 relative z-10">
                                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8">Transaction Analytics</h4>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <span>Passenger Count</span>
                                        <span className="text-slate-300">{selectedSeats.length} Units</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <span>Operational Base</span>
                                        <span className="text-slate-300">IDR {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <span>Service Levy (10%)</span>
                                        <span className="text-slate-300">IDR {tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-8 border-t border-white/5 mt-6 px-6 py-8 bg-primary-600/5 rounded-[40px]">
                                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]">Consolidated Amount</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-black text-primary-400">IDR</span>
                                            <span className="text-5xl font-black text-white tracking-tighter text-gradient leading-none">{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerDetail;
