import api from './api';

const flightService = {
    /**
     * Get all airports for dropdowns
     */
    getAirports: async () => {
        const response = await api.get('/airports');
        return response.data;
    },

    /**
     * Search for flights with filters
     * @param {Object} params - { from, to, date, class, etc }
     */
    getFlights: async (params) => {
        const response = await api.get('/flights', { params });
        return response.data;
    },

    /**
     * Get detail for a specific flight
     * @param {string|number} id 
     */
    getFlightById: async (id) => {
        const response = await api.get(`/flights/${id}`);
        return response.data;
    }
};

export default flightService;
