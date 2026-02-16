import { useState, useEffect, useCallback } from 'react';
import { Plane, Plus, Search, Edit3, Trash2, MoreVertical, Filter, Download, Loader2, AlertCircle } from 'lucide-react';
import flightService from '../../services/flightService';

const AdminDashboard = () => {
    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFlights = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await flightService.getFlights();
            const list = Array.isArray(data) ? data : data?.data;
            setFlights(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Fetch flights failed:', err);
            setError('Failed to fetch flights for management.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFlights();
    }, [fetchFlights]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            // In a real app, call an API here.
            setFlights(flights.filter(f => f.id !== id));
            alert('Flight deleted successfully (Local state updated).');
        }
    };

    const filteredFlights = flights.filter(f =>
        f.flight_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.airline_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-24 pb-20 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Admin <span className="text-gradient">Dashboard</span></h1>
                        <p className="text-slate-400">Manage your flights, airlines, and bookings from one place.</p>
                    </div>
                    <button className="btn-premium flex items-center gap-2">
                        <Plus size={20} />
                        <span>Add New Flight</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Flights', value: flights.length, color: 'text-primary-400' },
                        { label: 'Active Routes', value: [...new Set(flights.map(f => `${f.origin_airport_code}-${f.destination_airport_code}`))].length, color: 'text-secondary-400' },
                        { label: 'Total Revenue', value: 'IDR 4.2B', color: 'text-green-400' },
                        { label: 'Pending Bookings', value: '342', color: 'text-orange-400' },
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-card p-6 rounded-3xl border-white/5">
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Management Table */}
                <div className="glass-card rounded-[40px] overflow-hidden border-white/5">
                    <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search flight number..."
                                    className="bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary-500 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="glass p-3 rounded-xl border-slate-700 text-slate-400 hover:text-white">
                                <Filter size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="glass px-4 py-2.5 rounded-xl border-slate-700 text-sm font-bold flex items-center gap-2">
                                <Download size={16} /> Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-primary-500" size={48} />
                                <p className="text-slate-400 font-bold">Synchronizing Flight Data...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                                <AlertCircle size={48} className="text-red-400" />
                                <h3 className="text-xl font-bold">{error}</h3>
                                <button onClick={fetchFlights} className="btn-premium px-6 py-2">Retry</button>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/20 text-slate-500 uppercase text-[10px] tracking-widest font-black">
                                        <th className="px-8 py-6">Flight Info</th>
                                        <th className="px-8 py-6">Route</th>
                                        <th className="px-8 py-6">Sched. Time</th>
                                        <th className="px-8 py-6">Base Price</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {filteredFlights.map((flight) => (
                                        <tr key={flight.id} className="hover:bg-primary-600/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-primary-400">
                                                        {flight.airline_logo ? (
                                                            <img src={flight.airline_logo} className="w-full h-full object-cover rounded-xl" alt="" />
                                                        ) : (
                                                            <Plane size={20} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white uppercase">{flight.flight_number}</p>
                                                        <p className="text-xs text-slate-500">{flight.airline_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-medium text-slate-300 uppercase">{flight.origin_airport_code} → {flight.destination_airport_code}</p>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-slate-400">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-xs">{flight.departure_date}</span>
                                                    <span>{flight.departure_time} - {flight.arrival_time}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-bold text-gradient">
                                                IDR {parseInt(flight.base_price).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="w-9 h-9 glass flex items-center justify-center rounded-lg text-slate-400 hover:text-primary-400 hover:border-primary-500 transition-all">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(flight.id)}
                                                        className="w-9 h-9 glass flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:border-red-500 transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <button className="w-9 h-9 glass flex items-center justify-center rounded-lg text-slate-400">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {!isLoading && !error && (
                        <div className="p-8 border-t border-slate-800 flex justify-between items-center">
                            <p className="text-sm text-slate-500">Showing {filteredFlights.length} flights</p>
                            <div className="flex gap-2">
                                <button className="glass px-4 py-2 rounded-lg border-slate-700 text-sm disabled:opacity-50" disabled>Previous</button>
                                <button className="btn-premium px-4 py-2 rounded-lg text-sm">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
