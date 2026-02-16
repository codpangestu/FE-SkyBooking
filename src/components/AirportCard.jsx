import { MapPin, Plane, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AirportCard = ({ airport, onClick }) => {
    // Placeholder image for destinations
    const imageUrl = `https://images.unsplash.com/photo-1500835595306-b717e26c1c2b?auto=format&fit=crop&q=80&w=400`;

    return (
        <div
            onClick={onClick}
            className="glass-card group relative overflow-hidden rounded-[32px] cursor-pointer hover:border-primary-500/50 transition-all duration-500 hover:-translate-y-2 h-[400px]"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src={airport.image || `https://images.unsplash.com/photo-1464010149027?auto=format&fit=crop&q=80&w=600`}
                    alt={airport.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary-400">
                        <MapPin size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">{airport.city}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                        {airport.name}
                    </h3>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <div className="bg-slate-800/50 p-2 rounded-lg">
                            <Plane size={14} className="text-primary-500" />
                        </div>
                        <span className="text-sm font-bold font-mono tracking-tighter uppercase">
                            {airport.code || airport.iata || airport.iata_code || airport.airport_code}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <span className="text-xs font-bold uppercase tracking-widest">Explore</span>
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>

            {/* Premium Glow Effect */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-600/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
    );
};

export default AirportCard;
