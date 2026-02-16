import { useMemo, useCallback } from 'react';
import useBookingStore from '../store/useBookingStore';

export const usePricing = () => {
    const selectedFlight = useBookingStore((state) => state.selectedFlight);
    const selectedClass = useBookingStore((state) => state.selectedClass);
    const selectedSeats = useBookingStore((state) => state.selectedSeats);
    const discount = useBookingStore((state) => state.discount);
    const setDiscount = useBookingStore((state) => state.setDiscount);

    const pricing = useMemo(() => {
        // Handle both object and string for selectedClass
        const classObj = typeof selectedClass === 'string'
            ? selectedFlight?.mappedClasses?.find(c => c.type === selectedClass)
            : selectedClass;

        const basePrice = classObj?.price || selectedFlight?.basePrice || 0;
        const count = selectedSeats.length;

        const subtotal = basePrice * count;
        const tax = subtotal * 0.1; // 10% Tax
        const total = (subtotal + tax) - discount;

        return { subtotal, tax, discount, total };
    }, [selectedFlight, selectedClass, selectedSeats, discount]);

    const applyPromoCode = useCallback((code) => {
        if (code.toUpperCase() === 'SKY2026') {
            const amount = 50000; // IDR 50k discount
            setDiscount(amount);
            return { success: true, message: `Promo applied! You saved IDR ${amount.toLocaleString()}` };
        }
        setDiscount(0);
        return { success: false, message: 'Invalid or expired promo code.' };
    }, [setDiscount]);

    return { ...pricing, applyPromoCode };
};
