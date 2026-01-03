import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ChevronLeft, ChevronRight, ArrowRight, User, MapPin, Globe, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
    const { cartItems, removeFromCart, updateQty, shippingAddress, saveShippingAddress } = useCart();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const [loading, setLoading] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = cartItems.length > 0 ? 50 : 0;
    const total = subtotal + shipping;

    const checkoutHandler = async () => {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userInfo) {
            navigate('/login');
            return;
        }

        if (!address || !city || !postalCode || !country) {
            alert("Please fill in all shipping address fields.");
            setLoading(false);
            return;
        }

        saveShippingAddress({ address, city, postalCode, country });

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    orderItems: cartItems.map(item => ({
                        name: item.name,
                        qty: item.qty,
                        image: item.image,
                        price: item.price,
                        product: item._id,
                    })),
                    shippingAddress: { address, city, postalCode, country },
                    paymentMethod: 'Stripe',
                    itemsPrice: subtotal,
                    shippingPrice: shipping,
                    totalPrice: total,
                }),
            });

            console.log('Checkout response status:', response.status);

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}`);
            }

            if (response.ok && data.url) {
                window.location.href = data.url;
            } else {
                const errorMsg = data.message || data.error || 'Checkout failed';
                console.error('Checkout failed logic:', errorMsg);
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Checkout Catch Error:', error);
            alert(`Oops! ${error.message || 'Something went wrong during checkout'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-grow pt-8 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                        <ShoppingBag className="mr-3 text-orange-600" />
                        Your Shopping Cart
                    </h1>

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="text-orange-600 w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                            <Link
                                to="/"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mb-8">
                                    <ul className="divide-y divide-gray-100">
                                        {cartItems.map((item) => (
                                            <li key={item._id} className="p-6 flex flex-col sm:flex-row items-center">
                                                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="sm:ml-6 flex-1 text-center sm:text-left">
                                                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                                    <p className="mt-1 text-orange-600 font-bold">${item.price}</p>
                                                </div>
                                                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                                                    <div className="flex items-center border border-gray-200 rounded-full">
                                                        <button
                                                            onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                                                            className="p-2 cursor-pointer hover:bg-gray-100 rounded-l-full transition-colors"
                                                        >
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-medium">{item.qty}</span>
                                                        <button
                                                            onClick={() => updateQty(item._id, item.qty + 1)}
                                                            className="p-2 cursor-pointer hover:bg-gray-100 rounded-r-full transition-colors"
                                                        >
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="mt-4 sm:mt-0 sm:ml-8 text-right min-w-[80px]">
                                                    <p className="text-lg font-bold text-gray-900">${item.price * item.qty}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <MapPin className="mr-2 text-orange-600" />
                                        Shipping Address
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="123 Wood St"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder="New York"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                            <input
                                                type="text"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                placeholder="10001"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    placeholder="USA"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                                    required
                                                />
                                                <Globe className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4">
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                        <CreditCard className="mr-2 text-orange-600" />
                                        Order Summary
                                    </h2>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-gray-900">${subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span className="font-semibold text-gray-900">${shipping}</span>
                                        </div>
                                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-orange-600">${total}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={checkoutHandler}
                                        disabled={loading || !address || !city || !postalCode || !country}
                                        className="cursor-pointer w-full mt-8 bg-black text-white py-4 rounded-full font-semibold flex items-center justify-center space-x-2 hover:bg-gray-800 transition-all duration-300 group disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <span>Pay with Stripe</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <p className="mt-4 text-xs text-gray-500 text-center">
                                        Secure payment powered by Stripe
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
