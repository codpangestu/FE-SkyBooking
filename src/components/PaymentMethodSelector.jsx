import React from 'react';
import { CreditCard, Wallet, Landmark, QrCode } from 'lucide-react';

const methods = [
    { id: 'visa', name: 'Visa / Mastercard', icon: CreditCard, description: 'International Credit or Debit Card' },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: Landmark, description: 'Virtual Account or Manual Transfer' },
    { id: 'e-wallet', name: 'Digital Wallet', icon: Wallet, description: 'GoPay, OVO, or Dana' },
    { id: 'qr_code', name: 'QRIS Payment', icon: QrCode, description: 'Scan & Pay Instantly' },
];

const PaymentMethodSelector = ({ value, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((method) => {
                const Icon = method.icon;
                const isSelected = value === method.id;

                return (
                    <div
                        key={method.id}
                        onClick={() => onChange(method.id)}
                        className={`
                            p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-500 relative overflow-hidden group
                            ${isSelected
                                ? 'bg-primary-600 border-primary-500 shadow-2xl shadow-primary-500/20'
                                : 'bg-slate-900/50 border-white/5 hover:border-white/10'
                            }
                        `}
                    >
                        {isSelected && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                        )}

                        <div className="flex items-center gap-5 relative z-10">
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                                ${isSelected ? 'bg-white text-primary-600' : 'bg-slate-900 border border-white/5 text-slate-400 group-hover:text-white'}
                            `}>
                                <Icon className="w-7 h-7" />
                            </div>

                            <div>
                                <h4 className={`font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                    {method.name}
                                </h4>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-primary-100/70' : 'text-slate-500'}`}>
                                    {method.description}
                                </p>
                            </div>
                        </div>

                        {isSelected && (
                            <div className="absolute bottom-4 right-6 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                                Selected
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PaymentMethodSelector;
