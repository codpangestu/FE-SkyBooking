import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Tag, CheckCircle, ShieldCheck, ChevronRight, Info, Plane, Calendar, MapPin, User, Mail, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import useBookingStore from '../store/useBookingStore';
import { usePricing } from '../hooks/usePricing';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import api from '../services/api';

const Payment = () => {
    const navigate = useNavigate();

    // Using selectors for reliability
    const {
        selectedFlight,
        selectedClass,
        selectedSeats,
        passengerDetails,
        clearBooking
    } = useBookingStore();

    const { subtotal, tax, discount, total, applyPromoCode } = usePricing();

    const [promoCode, setPromoCode] = useState('');
    const [promoResult, setPromoResult] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        if (!selectedFlight || !passengerDetails || passengerDetails.length === 0) {
            navigate('/all-flights');
        }
    }, [selectedFlight, passengerDetails, navigate]);

    const handleApplyPromo = () => {
        if (!promoCode) return;
        const result = applyPromoCode(promoCode);
        setPromoResult(result);
    };

    const handlePayment = async () => {
        if (!selectedMethod) return;

        try {
            setIsProcessing(true);

            const transactionData = {
                flight_id: selectedFlight.id,
                flight_class_id: selectedClass?.id || selectedClass,
                name: passengerDetails[0]?.name || 'Guest User',
                email: passengerDetails[0]?.email || 'guest@example.com',
                phone: passengerDetails[0]?.phone || '0000000000',
                promo_code: discount > 0 ? promoCode : null,
                passengers: passengerDetails.map(p => {
                    // Sanitize seat ID: Must be an integer or null for backend validation
                    const seatId = parseInt(p.flight_seat_id);
                    return {
                        name: p.name,
                        date_of_birth: p.date_of_birth,
                        nationality: p.nationality,
                        flight_seat_id: isNaN(seatId) ? null : seatId,
                        seat_number: p.seat
                    };
                }),
                payment_method: selectedMethod
            };

            const response = await api.post('/transactions', transactionData);
            const rawData = response.data;
            const success = rawData.success || (rawData.status === 'success');

            if (success) {
                setIsProcessing(false);
                setIsPaid(true);
            } else {
                alert('Settlement Failed: ' + (rawData.message || 'System rejection.'));
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Transaction Error:', error);
            // Enhanced Error Reporting for Validation Failures
            if (error.response?.status === 422) {
                const validationMsg = error.response.data.message || 'Data validation failed.';
                alert('Validation Alert: ' + validationMsg);
            } else {
                const errorMessage = error.response?.data?.message || 'Gateway connection lost. Please verify your connection.';
                alert('Security Error: ' + errorMessage);
            }
            setIsProcessing(false);
        }
    };

    if (isPaid) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

                <div className="glass-card max-w-xl w-full p-16 text-center rounded-[64px] border border-white/10 shadow-2xl relative z-10 animate-in zoom-in-95 duration-1000">
                    <div className="w-32 h-32 bg-emerald-500/10 border-4 border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                        <CheckCircle className="w-16 h-16 animate-in fade-in zoom-in duration-700 delay-300 fill-emerald-500/10" />
                    </div>
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Voyage Authorized
                    </div>
                    <h1 className="text-5xl font-black text-white mb-6 tracking-tighter leading-none">Payment <br /><span className="text-gradient">Verified!</span></h1>
                    <p className="text-slate-400 font-bold mb-14 leading-relaxed tracking-tight">
                        Your voyage from <span className="text-white">{selectedFlight.originCity}</span> to <span className="text-white">{selectedFlight.destCity}</span> has been confirmed.
                    </p>

                    <div className="flex flex-col gap-4 mb-12 relative z-10">
                        <button
                            onClick={() => { clearBooking(); navigate('/'); }}
                            className="btn-premium py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Return to Command Center
                        </button>
                        <button
                            onClick={() => { clearBooking(); navigate('/profile'); }}
                            className="py-5 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] hover:text-primary-400 transition-colors"
                        >
                            View My Booking History
                        </button>
                    </div>

                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] pb-4">Manifest ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                </div>
            </div>
        );
    }

    if (!selectedFlight || !selectedClass) return null;

    return (
        <div className="min-h-screen pb-24">
            {/* Branded Header */}
            <div className="pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950/20"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Back to Manifest Details</span>
                    </button>

                    <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                                <span className="bg-primary-500/20 px-3 py-1 rounded-full border border-primary-500/20 text-primary-300">Step 05</span>
                                Financial Settlement
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">Authorize Your <br /><span className="text-gradient">Secure Voyager</span></h1>
                            <p className="text-slate-400 font-bold max-w-xl leading-relaxed text-sm md:text-base uppercase tracking-wider">
                                Review your global flight investment and authorize through our triple-encrypted gateway.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-grow space-y-10">
                        {/* Summary */}
                        <div className="glass-card p-10 rounded-[48px] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500 opacity-50"></div>
                            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 tracking-tight relative z-10">
                                <div className="w-12 h-12 bg-primary-950/50 border border-primary-500/20 rounded-2xl flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-primary-400" />
                                </div>
                                Boarding Manifest Review
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                {passengerDetails.map((p, i) => (
                                    <div key={i} className="flex items-center gap-5 p-6 bg-slate-900/50 rounded-[24px] border border-white/5 group hover:border-primary-500/20 transition-all">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-primary-400 font-black border border-white/10 shadow-inner text-xl">
                                            {p.seat}
                                        </div>
                                        <div className="truncate">
                                            <p className="font-black text-white uppercase tracking-tight truncate leading-none mb-2">{p.name}</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none truncate">{p.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Promo */}
                        <div className="glass-card p-10 rounded-[48px] border border-white/5 relative overflow-hidden">
                            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 tracking-tight relative z-10">
                                <div className="w-12 h-12 bg-primary-950/50 border border-primary-500/20 rounded-2xl flex items-center justify-center">
                                    <Tag className="w-6 h-6 text-primary-400" />
                                </div>
                                Advantage Codes
                            </h3>
                            <div className="flex flex-col md:flex-row gap-5 relative z-10">
                                <div className="flex-grow relative group">
                                    <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="INPUT SECRET CODE (SKY2026)"
                                        className="w-full h-18 rounded-[24px] border-2 border-white/5 focus:border-primary-500/50 bg-slate-900/50 pl-16 pr-6 font-black uppercase tracking-[0.2em] text-white outline-none transition-all"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleApplyPromo}
                                    className="px-12 bg-white text-slate-950 h-18 rounded-[24px] font-black uppercase tracking-[0.2em] hover:bg-primary-400 transition-all shadow-xl shadow-white/5"
                                >
                                    Apply
                                </button>
                            </div>
                            {promoResult && (
                                <div className={`mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${promoResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'} animate-in fade-in slide-in-from-top-4 duration-500 relative z-10`}>
                                    <div className={`w-2 h-2 rounded-full ${promoResult.success ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{promoResult.message}</span>
                                </div>
                            )}
                        </div>

                        <div className="glass-card p-10 rounded-[48px] border border-white/5 relative overflow-hidden">
                            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4 tracking-tight relative z-10">
                                <div className="w-12 h-12 bg-primary-950/50 border border-primary-500/20 rounded-2xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-primary-400" />
                                </div>
                                Select Settlement Gateway
                            </h3>
                            <div className="relative z-10">
                                <PaymentMethodSelector value={selectedMethod} onChange={setSelectedMethod} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-[450px]">
                        <div className="glass-card p-10 rounded-[64px] sticky top-24 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden group">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>

                            <h3 className="font-black text-white mb-10 uppercase tracking-[0.3em] text-xs text-slate-500 relative z-10">Investment Summary</h3>

                            <div className="space-y-10 relative z-10">
                                <div className="bg-slate-950 p-8 rounded-[40px] border border-white/5 space-y-6 shadow-inner">
                                    <div className="flex items-center gap-5 border-b border-white/5 pb-6">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-lg">
                                            <img src={selectedFlight.airlineLogo} alt="" className="max-h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1.5">Aviation Asset</p>
                                            <p className="font-black text-white text-lg leading-none uppercase tracking-tighter">{selectedFlight.airlineName}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center px-4 relative">
                                        <div className="text-center relative z-10">
                                            <p className="text-2xl font-black text-white tracking-tighter mb-1">{selectedFlight.originCode}</p>
                                            <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest leading-none">{selectedFlight.originCity}</p>
                                        </div>
                                        <div className="flex-grow flex items-center justify-center relative">
                                            <div className="w-full h-px bg-slate-800 absolute"></div>
                                            <Plane className="w-4 h-4 text-primary-500 rotate-90 relative z-10 bg-slate-950 px-1 opacity-40" />
                                        </div>
                                        <div className="text-center relative z-10">
                                            <p className="text-2xl font-black text-white tracking-tighter mb-1">{selectedFlight.destCode}</p>
                                            <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest leading-none">{selectedFlight.destCity}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 px-4">
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <span className="flex items-center gap-2">Flight Manifest ({selectedSeats.length}x)</span>
                                        <span className="text-slate-300">IDR {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <span>Infrastructure Levy (10%)</span>
                                        <span className="text-slate-300">IDR {tax.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                                            <span className="flex items-center gap-2"><Sparkles className="w-3 h-3" /> Preferred Discount</span>
                                            <span>-IDR {discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-3 pt-10 border-t border-white/5 mt-6">
                                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em] leading-none mb-1 text-right">Total Settlement Amount</span>
                                        <div className="flex items-baseline justify-end gap-3 px-2">
                                            <span className="text-xl font-black text-primary-400">IDR</span>
                                            <span className="text-6xl font-black text-white tracking-tighter text-gradient leading-none">{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={!selectedMethod || isProcessing}
                                    onClick={handlePayment}
                                    className={`btn-premium w-full py-8 rounded-[32px] text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center gap-5 transition-all duration-700 relative overflow-hidden group/btn shadow-2xl
                                        ${selectedMethod && !isProcessing ? 'shadow-primary-600/20 hover:scale-[1.02] active:scale-95' : 'opacity-20 cursor-not-allowed grayscale'}
                                    `}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="w-7 h-7 animate-spin" />
                                    ) : (
                                        <>
                                            Authorize Settlement
                                            <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1.5 transition-transform" />
                                        </>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-700"></div>
                                </button>

                                <div className="flex items-center justify-center gap-3 opacity-30">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[8px] font-black text-white uppercase tracking-[0.5em]">Bank-Level Security Override</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
