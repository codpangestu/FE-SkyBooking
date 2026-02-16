import { Plane, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand Section */}
                <div className="space-y-6">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-primary-600 p-2 rounded-xl">
                            <Plane className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-gradient">SkyBooking</span>
                    </Link>
                    <p className="text-slate-400 leading-relaxed">
                        Experience the next generation of flight booking. Premium comfort, seamless transactions, and world-class service at your fingertips.
                    </p>
                    <div className="flex space-x-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="w-10 h-10 glass flex items-center justify-center rounded-xl hover:bg-primary-600 transition-all duration-300 hover:-translate-y-1"
                            >
                                <Icon size={18} className="text-slate-300" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        {['Home', 'Flights', 'About Us', 'Contact'].map((item) => (
                            <li key={item}>
                                <Link to="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 className="text-lg font-bold mb-6">Support</h4>
                    <ul className="space-y-4">
                        {['Privacy Policy', 'Terms of Service', 'FAQ', 'Support Center'].map((item) => (
                            <li key={item}>
                                <Link to="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact info */}
                <div className="space-y-6">
                    <h4 className="text-lg font-bold mb-6">Contact Us</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center space-x-3 text-slate-400">
                            <MapPin size={18} className="text-primary-500" />
                            <span>123 Aviation Way, Sky City</span>
                        </li>
                        <li className="flex items-center space-x-3 text-slate-400">
                            <Phone size={18} className="text-primary-500" />
                            <span>+1 (555) 000-SKY</span>
                        </li>
                        <li className="flex items-center space-x-3 text-slate-400">
                            <Mail size={18} className="text-primary-500" />
                            <span>support@skybooking.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} SkyBooking Inc. All rights reserved.
                </p>
                <div className="flex space-x-6 text-sm text-slate-500">
                    <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
                    <a href="#" className="hover:text-slate-300 transition-colors">Cookies</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
