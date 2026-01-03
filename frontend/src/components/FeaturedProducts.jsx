import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const FeaturedProducts = ({ keyword }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { addToCart } = useCart()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // If keyword exists, append it to the URL
                const url = keyword
                    ? `http://localhost:5000/api/products?keyword=${keyword}`
                    : 'http://localhost:5000/api/products';

                const response = await fetch(url)
                const data = await response.json()
                if (response.ok) {
                    setProducts(data)
                } else {
                    setError('Failed to fetch products')
                }
            } catch (err) {
                setError('Something went wrong. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [keyword])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-24 text-red-600 font-medium">
                {error}
            </div>
        )
    }

    return (
        <div className="bg-white py-16 sm:py-24" id="shop">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-serif">
                        {keyword ? `Search Results for "${keyword}"` : 'Featured Collections'}
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        {keyword ? 'Found these products matching your search.' : 'Discover our most popular pieces, crafted with care and precision.'}
                    </p>
                </div>

                <div className="mt-12 grid gap-y-10 gap-x-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <motion.div
                            key={product._id}
                            whileHover={{ y: -5 }}
                            className="group relative cursor-pointer"
                        >
                            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <Link to={`/product/${product._id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">${product.price}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addToCart(product, 1);
                                }}
                                className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 cursor-pointer z-50 relative"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <span>Add to Cart</span>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FeaturedProducts
