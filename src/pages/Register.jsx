import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Mail, Lock, User, UserPlus, AlertCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        const result = await register(formData);

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-6 relative overflow-hidden pb-20">
            {/* Atmospheric Blurs */}
            <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-primary-600/10 rounded-full blur-[160px] -ml-64 -mt-64 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] -mr-32 -mb-32"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="glass-card p-12 rounded-[56px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-950 border border-primary-500 shadow-[0_0_30px_rgba(147,51,234,0.3)] mb-8 transform group-hover:rotate-6 transition-transform duration-700">
                            <UserPlus className="text-primary-400" size={36} />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            Identity Establishment
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">Global <br /><span className="text-gradient">Citizenship</span></h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest leading-relaxed">Join the elite manifest for premium travel</p>
                    </div>

                    {error && (
                        <div className="mb-10 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle size={20} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Full Name</label>
                                <div className="relative group/input">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full h-18 bg-slate-950/50 border-2 border-white/5 rounded-[24px] pl-16 pr-6 outline-none focus:border-primary-500/50 focus:bg-slate-900 transition-all font-black text-white placeholder-slate-700 uppercase tracking-widest text-[10px]"
                                        placeholder="Legal Identity"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Email Address</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-18 bg-slate-950/50 border-2 border-white/5 rounded-[24px] pl-16 pr-6 outline-none focus:border-primary-500/50 focus:bg-slate-900 transition-all font-black text-white placeholder-slate-700 uppercase tracking-widest text-[10px]"
                                        placeholder="name@mail.com"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Password</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full h-18 bg-slate-950/50 border-2 border-white/5 rounded-[24px] pl-16 pr-6 outline-none focus:border-primary-500/50 focus:bg-slate-900 transition-all font-black text-white placeholder-slate-700 uppercase tracking-widest text-[10px]"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Confirm Cipher</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full h-18 bg-slate-950/50 border-2 border-white/5 rounded-[24px] pl-16 pr-6 outline-none focus:border-primary-500/50 focus:bg-slate-900 transition-all font-black text-white placeholder-slate-700 uppercase tracking-widest text-[10px]"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-premium w-full h-18 text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 group/btn mt-4 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="w-7 h-7 animate-spin" />
                            ) : (
                                <>
                                    <span>Forge Identity</span>
                                    <ArrowRight size={22} className="group-hover/btn:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-14 pt-10 border-t border-white/5 text-center">
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                            Existing Identity?{' '}
                            <Link to="/login" className="text-primary-500 font-black hover:text-white transition-colors ml-2 underline decoration-primary-500/30 underline-offset-4">
                                Authenticate
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
