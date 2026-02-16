import { useState, useEffect, useCallback } from 'react';
import { User, Mail, Shield, Ticket, Calendar, Plane, MapPin, Loader2, AlertCircle, ChevronRight, Clock, Hash, Smartphone, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import authService from '../services/authService';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [userData, txData] = await Promise.all([
                authService.getProfile(),
                bookingService.getMyTransactions()
            ]);
            setUser(userData?.data || userData);
            const list = Array.isArray(txData) ? txData : (txData?.data?.data || txData?.data || []);
            setTransactions(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Fetch profile data failed:', err);
            setError('System synchronization failed during profile retrieval.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
                <p className="mt-6 text-slate-400 font-black text-xl animate-pulse uppercase tracking-[0.2em]">Synchronizing Vault...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6">
                <AlertCircle size={64} className="text-red-400" />
                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{error}</h2>
                <button onClick={fetchData} className="btn-premium px-8 py-3">Retry Sync</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24">
            {/* Profile Header */}
            <div className="pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950/20"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Return to Navigation</span>
                    </button>

                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary-500 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-900 border-2 border-primary-500 shadow-2xl rounded-[40px] flex items-center justify-center relative z-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent"></div>
                                    <User size={64} className="text-primary-400 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-slate-950 rounded-2xl flex items-center justify-center z-20 shadow-lg">
                                    <Shield size={18} className="text-white" />
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                                    <span className="bg-primary-500/20 px-3 py-1 rounded-full border border-primary-500/20 text-primary-300">Verified Member</span>
                                    Identity Profile
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-none">{user?.name}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-500" /> {user?.email}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary-500" /> Joined {new Date(user?.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card p-10 rounded-[48px] border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Service Metrics</h3>

                            <div className="space-y-8">
                                <div className="bg-slate-950/50 p-6 rounded-[32px] border border-white/5 group-hover:border-primary-500/20 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
                                            <Ticket size={20} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-600">Total Voyages</span>
                                    </div>
                                    <p className="text-4xl font-black text-white tracking-tighter">{transactions.length}</p>
                                </div>

                                <div className="bg-slate-950/50 p-6 rounded-[32px] border border-white/5 group-hover:border-primary-500/20 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                            <Smartphone size={20} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-600">Active Mobile</span>
                                    </div>
                                    <p className="text-xs font-black text-white tracking-widest break-all font-mono">ENCRYPTED_ID_{user?.id}</p>
                                </div>
                            </div>

                            <button className="btn-premium w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] mt-10">
                                Edit Identity
                            </button>
                        </div>

                        <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-gradient-to-b from-slate-900 to-slate-950">
                            <h3 className="text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] mb-6">SkyPass Benefits</h3>
                            <div className="space-y-6">
                                {[
                                    { title: 'Zero Priority', desc: 'Instant boarding access.' },
                                    { title: 'Vault Access', desc: 'Secure document storage.' },
                                    { title: 'Tier Upgrade', desc: 'Complimentary class bump.' }
                                ].map((perk, i) => (
                                    <div key={i} className="flex gap-4 group/perk">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0 group-hover/perk:scale-150 transition-transform"></div>
                                        <div>
                                            <p className="font-black text-xs text-white uppercase tracking-tight">{perk.title}</p>
                                            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase leading-tight">{perk.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Booking History */}
                    <div className="lg:col-span-3 space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
                            <h2 className="text-4xl font-black text-white tracking-tighter">My <span className="text-gradient">Boarding Archives</span></h2>
                            <div className="flex gap-4">
                                <span className="glass px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 border-white/5">{transactions.length} Records Detected</span>
                            </div>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="glass-card p-24 rounded-[64px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center group">
                                <div className="w-24 h-24 bg-slate-900/50 rounded-[32px] flex items-center justify-center text-slate-700 border border-white/5 mb-8 group-hover:scale-110 group-hover:border-primary-500/20 transition-all duration-700 shadow-inner">
                                    <Plane size={48} className="rotate-45" />
                                </div>
                                <h4 className="text-3xl font-black text-white mb-4 tracking-tighter">Clean Slate Voyager</h4>
                                <p className="text-slate-500 max-w-sm mx-auto font-bold text-sm leading-relaxed uppercase tracking-wider mb-10">
                                    The archives are currently empty. Begin your global conquest by exploring our premium routes today.
                                </p>
                                <button onClick={() => navigate('/all-flights')} className="btn-premium px-12 py-5 rounded-[28px] text-sm font-black uppercase tracking-[0.2em]">Initiate Flight Search</button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="relative group/tx">
                                        {/* Boarding Pass Style Card */}
                                        <div className="glass-card rounded-[48px] border border-white/5 hover:border-primary-500/20 transition-all duration-700 overflow-hidden flex flex-col md:flex-row shadow-2xl">

                                            {/* Status Badge Sidebar */}
                                            <div className="w-full md:w-56 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 relative">
                                                <div className="absolute top-0 bottom-0 right-[-1px] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />

                                                <div className={`
                                                    mb-6 w-full py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 border-2
                                                    ${tx.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/10 text-emerald-400' :
                                                        tx.status === 'pending' ? 'bg-amber-500/10 border-amber-500/10 text-amber-400' :
                                                            'bg-rose-500/10 border-rose-500/10 text-rose-400'}
                                                `}>
                                                    <div className={`w-2 h-2 rounded-full ${tx.status === 'success' ? 'bg-emerald-500' : tx.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`} />
                                                    {tx.status}
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2 leading-none">Manifest ID</p>
                                                    <p className="font-mono text-xs font-black text-primary-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner">#V-{tx.id.toString().padStart(6, '0')}</p>
                                                </div>
                                            </div>

                                            {/* Main Flight Info */}
                                            <div className="flex-grow p-10 flex flex-col justify-between space-y-10 group-hover/tx:bg-white/[0.01] transition-colors">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-white/5 p-3 shadow-inner flex items-center justify-center">
                                                            {tx.flight?.airline_logo ? (
                                                                <img src={tx.flight.airline_logo} alt="" className="max-h-full object-contain" />
                                                            ) : (
                                                                <Plane className="text-primary-500" />
                                                            )}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none mb-2">Voyage Route</p>
                                                            <h4 className="text-3xl font-black text-white tracking-tighter uppercase leading-none group-hover/tx:text-primary-400 transition-colors">
                                                                {tx.flight?.origin_airport_code || tx.flight?.origin_city} <span className="text-slate-700 tracking-normal px-1">→</span> {tx.flight?.destination_airport_code || tx.flight?.destination_city}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 leading-none">Deployment Date</p>
                                                        <div className="flex items-center gap-2 text-white font-black uppercase text-xs tracking-widest bg-slate-900 border border-white/5 px-4 py-2 rounded-xl">
                                                            <Calendar size={14} className="text-primary-500" />
                                                            {new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Fleet</p>
                                                        <p className="text-xs font-black text-white uppercase tracking-tight">{tx.flight?.airline_name || 'Sky Carrier'}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Manifest</p>
                                                        <p className="text-xs font-black text-white uppercase tracking-tight">{tx.passengers?.length || 1} Voyager{(tx.passengers?.length || 1) > 1 ? 's' : ''}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Settlement</p>
                                                        <p className="text-sm font-black text-emerald-400 tracking-tighter">IDR {parseInt(tx.total_price || 0).toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex justify-end items-end">
                                                        <button className="flex items-center gap-2 text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] group/btn">
                                                            Deep Details
                                                            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Boarding Pass Cut-out Decoration */}
                                        <div className="absolute top-1/2 -translate-y-1/2 right-[224px] w-6 h-12 bg-slate-950 rounded-l-full border-y border-l border-white/5 hidden md:block" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
