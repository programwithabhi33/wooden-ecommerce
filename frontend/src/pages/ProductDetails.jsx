import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Star, Share2, Heart, Truck, Shield, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setProduct(data);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(product, qty);
    };

    const buyNowHandler = () => {
        addToCart(product, qty);
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                    <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        <li>
                            <Link to="/" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Home</span>
                                Home
                            </Link>
                        </li>
                        <li>
                            <span className="text-gray-300">/</span>
                        </li>
                        <li>
                            <span className="text-gray-400 hover:text-gray-500">Products</span>
                        </li>
                        <li>
                            <span className="text-gray-300">/</span>
                        </li>
                        <li>
                            <span className="text-gray-900 font-medium" aria-current="page">{product.name}</span>
                        </li>
                    </ol>
                </nav>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Image gallery */}
                    <div className="flex flex-col-reverse">
                        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                            <img
                                src={product.image && (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`)}
                                alt={product.name}
                                className="w-full h-full object-center object-cover object-contain hover:scale-105 transition-transform duration-500"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-serif">{product.name}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl text-gray-900">₹{product.price}</p>
                        </div>

                        {/* Reviews */}
                        <div className="mt-3">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <Star
                                            key={rating}
                                            className="text-yellow-400 h-5 w-5 flex-shrink-0 fill-current"
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">5 out of 5 stars</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="text-base text-gray-700 space-y-6">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <span>|</span>
                                <span>Category: {product.category}</span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2 w-32 bg-white">
                                <span className="text-gray-500 text-sm">Qty:</span>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm outline-none"
                                >
                                    {[...Array(product.countInStock > 0 ? Math.min(10, product.countInStock) : 0).keys()].map(x => (
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                            <button
                                type="button"
                                onClick={addToCartHandler}
                                disabled={product.countInStock === 0}
                                className="cursor-pointer flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Add to Cart
                            </button>
                            <button
                                type="button"
                                onClick={buyNowHandler}
                                disabled={product.countInStock === 0}
                                className="cursor-pointer flex-1 bg-primary-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                            >
                                Buy Now
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>

                        <div className="mt-10 border-t border-gray-200 pt-10">
                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Truck className="h-6 w-6 text-primary-600" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <p className="font-medium text-gray-900">Free Shipping</p>
                                        <p className="text-gray-500">On orders over ₹500</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Shield className="h-6 w-6 text-primary-600" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <p className="font-medium text-gray-900">2-Year Warranty</p>
                                        <p className="text-gray-500">Included with purchase</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetails;
