import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
    user: authService.getCurrentUser(),
    token: localStorage.getItem('token'),
    isAuthenticated: authService.isAuthenticated(),

    login: async (credentials) => {
        try {
            const data = await authService.login(credentials);
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true
            });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    },

    register: async (userData) => {
        try {
            await authService.register(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    },

    logout: async () => {
        await authService.logout();
        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    }
}));

export default useAuthStore;
