import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="font-serif text-2xl font-bold text-primary-800">WoodenCraft</span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for furniture..."
                                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Desktop Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                            <User className="h-6 w-6" />
                        </Link>
                        <Link to="/cart" className="text-gray-600 hover:text-primary-600 transition-colors relative">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-primary-600 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="h-5 w-5" />
                                    <span>Account</span>
                                </Link>
                                <Link
                                    to="/cart"
                                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    <span>Cart (0)</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
