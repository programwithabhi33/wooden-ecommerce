import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

const products = [
    {
        id: 1,
        name: 'Oak Minimalist Chair',
        price: '$249',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Chairs'
    },
    {
        id: 2,
        name: 'Walnut Coffee Table',
        price: '$499',
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Tables'
    },
    {
        id: 3,
        name: 'Teak Bedside Lamp',
        price: '$129',
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Lighting'
    },
    {
        id: 4,
        name: 'Mahogany Bookshelf',
        price: '$899',
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Storage'
    }
]

const FeaturedProducts = () => {
    return (
        <div className="bg-white py-16 sm:py-24" id="shop">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-serif">
                        Featured Collections
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Discover our most popular pieces, crafted with care and precision.
                    </p>
                </div>

                <div className="mt-12 grid gap-y-10 gap-x-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
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
                                        <a href="#">
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </a>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{product.price}</p>
                            </div>
                            <button className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 cursor-pointer">
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
