import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/')
        }
    }, [navigate])

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (!email) {
            setError('Please enter your email address')
            return
        }

        // Logic to send reset link would go here (Backend integration needed later perhaps)
        setMessage('Password reset link sent to your email (Demo mode)')
    }

    return (
        <div className="flex flex-col min-h-screen bg-primary-50">
            <Navbar />
            <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
                >
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-serif">
                            Reset your password
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center">
                            {message}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors cursor-pointer"
                            >
                                Send Reset Link
                            </button>
                        </div>

                        <div className="text-center">
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 cursor-pointer">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
            <Footer />
        </div>
    )
}

export default ForgotPassword
