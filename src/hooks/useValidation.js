import { useState, useCallback } from 'react';

export const useValidation = () => {
    const [errors, setErrors] = useState({});

    const validateForm = useCallback((passengers) => {
        const newErrors = {};
        let isValid = true;

        passengers.forEach((p, index) => {
            const passengerErrors = {};

            if (!p.name || p.name.trim().length === 0) {
                passengerErrors.name = 'Full name is required';
                isValid = false;
            }

            if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
                passengerErrors.email = 'Valid email is required';
                isValid = false;
            }

            if (!p.phone || p.phone.trim().length < 8) {
                passengerErrors.phone = 'Valid phone number is required';
                isValid = false;
            }

            if (!p.date_of_birth) {
                passengerErrors.date_of_birth = 'Date of birth is required';
                isValid = false;
            }

            if (Object.keys(passengerErrors).length > 0) {
                newErrors[index] = passengerErrors;
            }
        });

        setErrors(newErrors);
        return isValid;
    }, []);

    return { errors, validateForm };
};
