import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search, ArrowRightLeft, Loader2 } from 'lucide-react';
import flightService from '../services/flightService';
import useBookingStore from '../store/useBookingStore';

const FlightSearch = ({ compact = false }) => {
    const navigate = useNavigate();
    const { searchFilter, setSearchFilter, airports, setAirports } = useBookingStore();
    const [isLoadingAirports, setIsLoadingAirports] = useState(false);

    const [formData, setFormData] = useState({
        from: searchFilter.origin || '',
        to: searchFilter.destination || '',
        date: searchFilter.date || '',
        passengers: searchFilter.passengers || 1,
    });

    useEffect(() => {
        const fetchAirports = async () => {
            if (airports.length > 0) return;
            setIsLoadingAirports(true);
            try {
                const data = await flightService.getAirports();
                const list = Array.isArray(data) ? data : data?.data;
                setAirports(Array.isArray(list) ? list : []);
            } catch (error) {
                console.error('Failed to fetch airports:', error);
            } finally {
                setIsLoadingAirports(false);
            }
        };
        fetchAirports();
    }, [airports.length, setAirports]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Update store
        setSearchFilter({
            origin: formData.from,
            destination: formData.to,
            date: formData.date,
            passengers: formData.passengers
        });
        // Navigate
        navigate('/all-flights');
    };

    const handleSwap = () => {
        setFormData(prev => ({
            ...prev,
            from: prev.to,
            to: prev.from
        }));
    };

    return (
        <div className={`glass-card ${compact ? 'p-4 rounded-2xl' : 'p-8 rounded-3xl'} shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700`}>
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-6 items-end">
                {/* From */}
                <div className="flex-1 w-full space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <MapPin size={16} className="text-primary-500" />
                        From
                    </label>
                    <div className="relative">
                        <input
                            list="airports-from"
                            type="text"
                            placeholder="Origin City or Airport"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-primary-500 outline-none transition-glass"
                            value={formData.from}
                            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                            required
                        />
                        {isLoadingAirports && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-500" />}
                    </div>
                    <datalist id="airports-from">
                        {airports.map(airport => {
                            const airportCode = airport.code || airport.iata || airport.iata_code || airport.airport_code;
                            return (
                                <option key={airport.id} value={`${airport.city} (${airportCode})`}>
                                    {airport.name}
                                </option>
                            );
                        })}
                    </datalist>
                </div>

                {/* Swap Icon (Desktop) */}
                <div
                    onClick={handleSwap}
                    className="hidden lg:flex items-center justify-center p-3 mb-1 text-slate-500 hover:text-primary-400 cursor-pointer transition-colors"
                >
                    <ArrowRightLeft size={20} />
                </div>

                {/* To */}
                <div className="flex-1 w-full space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <MapPin size={16} className="text-primary-500" />
                        To
                    </label>
                    <div className="relative">
                        <input
                            list="airports-to"
                            type="text"
                            placeholder="Destination City or Airport"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-primary-500 outline-none transition-glass"
                            value={formData.to}
                            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                            required
                        />
                        {isLoadingAirports && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-500" />}
                    </div>
                    <datalist id="airports-to">
                        {airports.map(airport => {
                            const airportCode = airport.code || airport.iata || airport.iata_code || airport.airport_code;
                            return (
                                <option key={airport.id} value={`${airport.city} (${airportCode})`}>
                                    {airport.name}
                                </option>
                            );
                        })}
                    </datalist>
                </div>

                {/* Date */}
                <div className="flex-1 w-full lg:w-48 space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Calendar size={16} className="text-primary-500" />
                        Departure
                    </label>
                    <input
                        type="date"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-primary-500 outline-none transition-glass"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>

                {/* Passengers */}
                <div className="w-full lg:w-32 space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Users size={16} className="text-primary-500" />
                        Travelers
                    </label>
                    <input
                        type="number"
                        min="1"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-primary-500 outline-none transition-glass"
                        value={formData.passengers}
                        onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                        required
                    />
                </div>

                {/* Search Button */}
                <button type="submit" className="btn-premium w-full lg:w-auto flex items-center justify-center gap-2 group min-w-[140px]">
                    <Search size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Search</span>
                </button>
            </form>
        </div>
    );
};

export default FlightSearch;
