import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'
import Footer from '../components/Footer'

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Hero />
                <FeaturedProducts />
            </main>
            <Footer />
        </div>
    )
}

export default Home
