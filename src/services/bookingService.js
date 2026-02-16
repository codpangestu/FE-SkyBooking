import api from './api';

const bookingService = {
    /**
     * Validate a promo code
     * @param {string} code 
     */
    checkPromoCode: async (code) => {
        const response = await api.post('/promo-codes/check', { code });
        return response.data;
    },

    /**
     * Create a new transaction (Booking)
     * @param {Object} data - { flight_id, passengers, etc }
     */
    createTransaction: async (data) => {
        const response = await api.post('/transactions', data);
        return response.data;
    },

    /**
     * Get all transactions for the current user
     */
    getMyTransactions: async () => {
        const response = await api.get('/transactions');
        return response.data;
    },

    /**
     * Get detailed info for a specific transaction
     * @param {string|number} id 
     */
    getTransactionDetail: async (id) => {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    }
};

export default bookingService;
