import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, ChevronLeft, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold mb-4">{error || 'Order not found'}</h2>
            <Link to="/profile" className="bg-orange-600 text-white px-6 py-2 rounded-full">Back to Profile</Link>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-grow pt-8 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Link to="/profile" className="inline-flex items-center text-orange-600 font-semibold mb-8 hover:-translate-x-1 transition-transform">
                        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Profile
                    </Link>

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                                <p className="text-sm text-gray-500 mt-1">Order #{order._id}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {order.isPaid ? 'Paid' : 'Payment Pending'}
                            </span>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Shipping info */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <MapPin className="mr-2 text-orange-600 w-5 h-5" /> Shipping
                                </h3>
                                <p className="text-gray-600">
                                    {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                                <p className="text-gray-600 mt-2">
                                    <span className="font-semibold">Contact:</span> {order.shippingAddress.contactNumber}
                                </p>
                            </div>

                            {/* Payment info */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <CreditCard className="mr-2 text-orange-600 w-5 h-5" /> Payment
                                </h3>
                                <p className="text-gray-600">Method: {order.paymentMethod || 'Stripe'}</p>
                                {order.isPaid ? (
                                    <p className="text-green-600 font-medium">Paid on {new Date(order.paidAt).toLocaleString()}</p>
                                ) : (
                                    <p className="text-yellow-600 font-medium">Not Paid</p>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-8 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <Package className="mr-2 text-orange-600 w-5 h-5" /> Order Items
                            </h3>
                            <div className="space-y-6">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="font-bold text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.qty} x ₹{item.price} = ₹{item.qty * item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-900">Total Price</span>
                                <span className="text-2xl font-extrabold text-orange-600">₹{order.totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderDetails;
