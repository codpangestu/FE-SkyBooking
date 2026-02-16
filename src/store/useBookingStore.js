import { create } from 'zustand';

// Flight booking state management
const useBookingStore = create((set) => ({
    searchFilter: {
        origin: '',
        destination: '',
        date: '',
        passengers: 1,
    },
    airports: [],
    selectedFlight: null,
    selectedClass: null,
    selectedSeats: [],
    passengerDetails: [],
    discount: 0,

    setSearchFilter: (filter) => set((state) => ({
        searchFilter: { ...state.searchFilter, ...filter }
    })),

    setAirports: (airports) => set({ airports }),

    setSelectedFlight: (flight) => set({ selectedFlight: flight }),
    setSelectedClass: (cls) => set({ selectedClass: cls }),
    setSelectedSeats: (seats) => set({ selectedSeats: seats }),
    setPassengerDetails: (details) => set({ passengerDetails: details }),
    setDiscount: (discount) => set({ discount }),

    clearBooking: () => set({
        searchFilter: {
            origin: '',
            destination: '',
            date: '',
            passengers: 1,
        },
        selectedFlight: null,
        selectedClass: null,
        selectedSeats: [],
        passengerDetails: [],
        discount: 0
    }),

    resetSearch: () => set((state) => {
        state.clearBooking();
        return {};
    })
}));

export default useBookingStore;
