import api from './api';

const authService = {
    login: async (credentials) => {
        const response = await api.post('/login', credentials);
        const data = response.data.data || response.data;
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },

    register: async (userData) => {
        const response = await api.post('/register', userData);
        return response.data.data || response.data;
    },

    logout: async () => {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    },

    getProfile: async () => {
        const response = await api.get('/user');
        return response.data.data || response.data;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export default authService;
