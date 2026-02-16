import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Github, Sparkles, Loader2 } from 'lucide-react';
import authService from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('admin@skybooking.com');
    const [password, setPassword] = useState('password');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await authService.login({ email, password });
            const user = data.user || (data.data && data.data.user);
            const role = user?.role || 'user';

            navigate(role === 'admin' ? '/admin' : '/');
            window.location.reload();
        } catch (err) {
            console.error('Login failed:', err);
            alert(err.response?.data?.message || 'Identity verification failed. Please re-authenticate.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-6 relative overflow-hidden">
            {/* Massive Atmospheric Blurs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[160px] -mr-96 -mt-96 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] -ml-64 -mb-64"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="glass-card p-12 rounded-[56px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-950 border border-primary-500 shadow-[0_0_30px_rgba(147,51,234,0.3)] mb-8 transform group-hover:rotate-6 transition-transform duration-700">
                            <LogIn className="text-primary-400" size={36} />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            Vault Access
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">Command <br /><span className="text-gradient">Entrance</span></h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest leading-relaxed">Secure your session for premium flight management</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Identity Email</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    className="w-full h-18 bg-slate-950/50 border-2 border-white/5 rounded-[24px] pl-16 pr-6 outline-none focus:border-primary-500/50 focus:bg-slate-900 transition-all font-black text-white placeholder-slate-700 uppercase tracking-widest text-xs"
                                    placeholder="Enter Authorized Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Security Cipher</label>
                                <a href="#" className="text-[9px] font-black text-primary-500 hover:text-white transition-colors uppercase tracking-widest">Forgot Keys?</a>
                            </div>
                            <div className="relative group/input">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    className="w-full h-18 bg-slate-950/50 border-2 border-white/5 rounded-[24px] pl-16 pr-6 outline-none focus:border-primary-500/50 focus:bg-slate-900 transition-all font-black text-white placeholder-slate-700 uppercase tracking-widest text-xs"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
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
                                    <span>Initiate Sync</span>
                                    <ArrowRight size={22} className="group-hover/btn:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-14 pt-10 border-t border-white/5">
                        <div className="relative flex justify-center mb-10">
                            <span className="bg-slate-950 px-6 text-[9px] font-black text-slate-600 relative z-10 uppercase tracking-[0.5em]">Terminal Overrides</span>
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <button className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-slate-900/50 border border-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                <Github size={18} />
                                GitHub
                            </button>
                            <button className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-slate-900/50 border border-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                <ShieldCheck size={18} />
                                SAML
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-12 text-slate-600 font-bold text-xs uppercase tracking-widest">
                    No clearance? <Link to="/register" className="text-primary-500 font-black hover:text-white transition-colors ml-2 underline decoration-primary-500/30 underline-offset-4">Establish Identity</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
