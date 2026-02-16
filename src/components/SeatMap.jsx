import React from 'react';
import { Armchair } from 'lucide-react';

const SeatMap = ({ seats, selectedSeats, onToggleSeat, classType }) => {
    // Group seats by row
    const rows = [...new Set(seats.map(s => s.row))].sort((a, b) => a - b);

    return (
        <div className="flex flex-col items-center gap-6 p-4 overflow-x-auto">
            {/* Legend */}
            <div className="flex gap-8 mb-10 px-8 py-4 bg-slate-900/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-slate-800 rounded-md border border-white/10"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary-600 rounded-md shadow-[0_0_10px_rgba(147,51,234,0.3)]"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-slate-950 rounded-md opacity-30"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Occupied</span>
                </div>
            </div>

            <div className="relative">
                {/* Airplane Nose Decoration */}
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 h-32 bg-slate-900/20 rounded-t-[100px] border-t border-x border-white/5 pointer-events-none hidden md:block"></div>

                <div className="space-y-4 relative">
                    {rows.map(rowNum => (
                        <div key={rowNum} className="flex items-center gap-5">
                            <div className="w-8 text-center text-[10px] font-black text-slate-600 uppercase tracking-tighter">{rowNum}</div>

                            <div className="flex items-center gap-3 md:gap-4">
                                {seats.filter(s => s.row === rowNum).map((seat, idx, rowSeats) => {
                                    const isSelected = selectedSeats.includes(seat.name);
                                    const isAisle = rowSeats.length === 6 ? idx === 2 : idx === 1;

                                    return (
                                        <React.Fragment key={seat.id}>
                                            <button
                                                disabled={!seat.is_available}
                                                onClick={() => onToggleSeat(seat.name)}
                                                className={`
                                                    group relative w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-500
                                                    ${!seat.is_available
                                                        ? 'bg-slate-950/50 opacity-10 cursor-not-allowed'
                                                        : isSelected
                                                            ? 'bg-primary-600 shadow-[0_0_20px_rgba(147,51,234,0.4)] scale-110 z-10 border-primary-400 border'
                                                            : 'bg-slate-900/80 border border-white/5 hover:border-primary-500/50 hover:bg-slate-800'
                                                    }
                                                `}
                                            >
                                                <Armchair
                                                    className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-500 ${!seat.is_available ? 'text-slate-800' : isSelected ? 'text-white' : 'text-slate-600 group-hover:text-primary-400'}`}
                                                />
                                                <span className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black transition-opacity duration-300 pointer-events-none ${isSelected ? 'opacity-100 text-primary-400' : 'opacity-0 text-slate-500'}`}>
                                                    {seat.name}
                                                </span>
                                            </button>

                                            {isAisle && (
                                                <div className="w-8 md:w-12 flex flex-col items-center justify-center gap-1 opacity-20">
                                                    <div className="h-full w-px bg-gradient-to-b from-transparent via-slate-500 to-transparent"></div>
                                                    <span className="text-[8px] font-black text-slate-500 rotate-90 uppercase tracking-widest vertical-text">Aisle</span>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
