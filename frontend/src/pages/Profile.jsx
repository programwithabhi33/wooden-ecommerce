import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Calendar, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const location = useLocation();
    const navigate = useNavigate();

    const fetchOrders = async () => {
        if (!userInfo) return;
        try {
            const response = await fetch('http://localhost:5000/api/orders/myorders', {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const verifyPayment = async () => {
            const searchParams = new URLSearchParams(location.search);
            const success = searchParams.get('success');
            const sessionId = searchParams.get('session_id');

            if (success && sessionId && userInfo) {
                try {
                    const response = await fetch('http://localhost:5000/api/orders/verify-payment', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                        body: JSON.stringify({ session_id: sessionId }),
                    });

                    if (response.ok) {
                        // Payment verified, refresh orders
                        fetchOrders();
                        // Clear URL params
                        navigate('/profile', { replace: true });
                        alert('Payment successful! Order updated.');
                    }
                } catch (error) {
                    console.error('Verification failed', error);
                }
            }
        };

        verifyPayment();
        fetchOrders();
    }, [location.search, navigate]);

    if (!userInfo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
                <a href="/login" className="bg-orange-600 text-white px-6 py-2 rounded-full">Login</a>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-grow pt-8 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                        <User className="w-12 h-12 text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{userInfo.name}</h2>
                                    <p className="text-gray-500">{userInfo.email}</p>
                                    <div className="mt-6 w-full pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Orders</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">0</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Wishlist</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                                    <Package className="mr-2 text-orange-600" />
                                    Order History
                                </h3>

                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                                    </div>
                                ) : error ? (
                                    <div className="text-red-500 text-center py-12">{error}</div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                                        <a href="/" className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold">Start Shopping</a>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order._id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Order ID</p>
                                                        <p className="text-sm font-bold text-gray-900">#{order._id.substring(0, 10).toUpperCase()}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {order.isPaid ? 'Paid' : 'Payment Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                    <div className="flex items-center">
                                                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                                        <p className="text-lg font-bold text-gray-900">₹{order.totalPrice}</p>
                                                    </div>
                                                    <Link to={`/order/${order._id}`} className="text-orange-600 font-semibold flex items-center hover:translate-x-1 transition-transform">
                                                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
