import React from 'react';
import { Plane, Wifi, Coffee, MonitorPlay, Zap, ChevronRight, Clock } from 'lucide-react';

const FlightCard = ({ flight, onSelect }) => {
    const getFacilityIcon = (name) => {
        const normalized = name.toLowerCase().replace(/[^a-z]/g, '');
        const iconMap = {
            wifi: <Wifi size={14} />,
            meal: <Coffee size={14} />,
            breakfast: <Coffee size={14} />,
            dinner: <Coffee size={14} />,
            entertainment: <MonitorPlay size={14} />,
            movie: <MonitorPlay size={14} />,
            power: <Zap size={14} />,
            outlet: <Zap size={14} />,
            charging: <Zap size={14} />,
            luggage: <Plane size={14} />,
            baggage: <Plane size={14} />
        };

        // Try exact match first, then normalized
        return iconMap[name.toLowerCase()] || iconMap[normalized] || null;
    };

    return (
    <div
        className="group glass-card rounded-[32px] md:rounded-[42px] p-6 md:p-8 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 relative overflow-hidden cursor-pointer"
        onClick={() => onSelect(flight)}
    >
        {/* Decorative Gradient */}
        <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-primary-600/5 rounded-bl-[100px] md:rounded-bl-[120px] -z-0 group-hover:bg-primary-600/10 transition-colors"></div>

        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center gap-8">

            {/* ================= AIRLINE ================= */}
            <div className="flex items-center gap-4 md:gap-6 w-full xl:w-64">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800/60 rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-inner flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-500">
                    <img
                        src={flight.airlineLogo || 'https://placehold.co/100x100?text=Airline'}
                        alt={flight.airlineName}
                        className="w-full h-full object-contain"
                    />
                </div>

                <div>
                    <h4 className="font-bold text-white text-base md:text-lg tracking-tight uppercase">
                        {flight.airlineName}
                    </h4>

                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] md:text-[10px] font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest border border-primary-500/20">
                            {flight.flight_number || 'SK-102'}
                        </span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            BOEING 737
                        </span>
                    </div>
                </div>
            </div>

            {/* ================= ROUTE ================= */}
            <div className="flex-1 w-full flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-10">

                {/* Departure */}
                <div className="text-center sm:text-left space-y-1">
                    <div className="text-2xl md:text-1xl font-bold text-white tracking-tighter">
                        {flight.departureTime}
                    </div>
                    <div className="text-xs font-bold text-primary-400 uppercase tracking-widest">
                        {flight.originCode}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[100px]">
                        {flight.originCity}
                    </div>
                </div>

                {/* Duration */}
                <div className="flex-1 max-w-[220px] flex flex-col items-center gap-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} className="text-primary-500" />
                        {flight.duration}
                    </div>

                    <div className="relative w-full h-[2px] bg-slate-800 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000"></div>
                    </div>

                    <div className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
                        {flight.type}
                    </div>
                </div>

                {/* Arrival */}
                <div className="text-center sm:text-right space-y-1">
                    <div className="text-2xl md:text-1xl font-bold text-white tracking-tighter">
                        {flight.arrivalTime}
                    </div>
                    <div className="text-xs font-bold text-primary-400 uppercase tracking-widest">
                        {flight.destCode}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[100px]">
                        {flight.destCity}
                    </div>
                </div>
            </div>

            {/* ================= PRICE ================= */}
            <div className="w-full xl:w-[220px] flex flex-col gap-5 border-t border-slate-800 pt-6 xl:pt-0 xl:border-t-0 xl:border-l xl:pl-8">

                {/* Price Box */}
                <div className="w-full bg-slate-900/50 rounded-2xl md:rounded-3xl px-5 md:px-6 py-4 md:py-5 text-center xl:text-right border border-slate-800 backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Starting From
                    </p>

                    <div className="flex justify-center xl:justify-end items-baseline gap-1">
                        <span className="text-sm font-medium text-slate-400">
                            IDR
                        </span>
                        <span className="text-2xl md:text-3xl font-bold text-gradient tracking-tight">
                            {parseInt(flight.price).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Button */}
                <button className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold tracking-wide hover:opacity-90 transition-all">
                    SELECT FLIGHT
                </button>
            </div>
        </div>

        {/* ================= FACILITIES ================= */}
        <div className="mt-6 md:mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6 text-slate-400 text-xs md:text-sm">
                {flight.facilities?.slice(0, 3).map((fac) => (
                    <div key={fac} className="flex items-center gap-2">
                        {getFacilityIcon(fac)}
                        <span className="uppercase tracking-wider">
                            {fac}
                        </span>
                    </div>
                ))}
            </div>

            <div className="text-[10px] md:text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 uppercase tracking-widest text-center">
                Refund & Reschedule Protected
            </div>
        </div>
    </div>
);

};

export default FlightCard;
