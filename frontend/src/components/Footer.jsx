import React from 'react'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-primary-900 text-primary-100 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <h3 className="font-serif text-2xl font-bold text-white mb-4">WoodenCraft</h3>
                        <p className="text-primary-200 text-sm leading-relaxed">
                            Crafting timeless wooden furniture for your modern home. Quality, durability, and style in every piece.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors cursor-pointer">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Shop</a></li>
                            <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Collections</a></li>
                            <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <span>123 Woodwork Lane, Forest City, FC 90210</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 flex-shrink-0" />
                                <span>hello@woodencraft.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-primary-400">
                        © {new Date().getFullYear()} WoodenCraft. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="text-primary-400 hover:text-white transition-colors cursor-pointer"><Facebook className="h-5 w-5" /></a>
                        <a href="#" className="text-primary-400 hover:text-white transition-colors cursor-pointer"><Twitter className="h-5 w-5" /></a>
                        <a href="#" className="text-primary-400 hover:text-white transition-colors cursor-pointer"><Instagram className="h-5 w-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
