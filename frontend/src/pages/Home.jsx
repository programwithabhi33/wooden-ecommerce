import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'
import Footer from '../components/Footer'

import { useParams } from 'react-router-dom';

const Home = () => {
    const { keyword } = useParams();
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                {!keyword && <Hero />}
                <FeaturedProducts keyword={keyword} />
            </main>
            <Footer />
        </div>
    )
}

export default Home
