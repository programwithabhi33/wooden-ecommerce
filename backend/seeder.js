const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const products = [
    {
        name: 'Modern Wooden Chair',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
        description: 'A comfortable and stylish modern wooden chair, perfect for any dining room or study.',
        category: 'Chairs',
        price: 250,
        countInStock: 10,
    },
    {
        name: 'Rustic Coffee Table',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80',
        description: 'Handcrafted rustic coffee table made from reclaimed oak wood.',
        category: 'Tables',
        price: 450,
        countInStock: 5,
    },
    {
        name: 'Minimalist Oak Bookshelf',
        image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
        description: 'Solid oak bookshelf with a minimalist design, offering ample storage space.',
        category: 'Storage',
        price: 600,
        countInStock: 7,
    },
    {
        name: 'Solid Walnut Dining Table',
        image: 'https://images.unsplash.com/photo-1577146333355-6302ca21966a?w=800&q=80',
        description: 'Beautiful solid walnut dining table that seats up to six people.',
        category: 'Tables',
        price: 1200,
        countInStock: 3,
    },
];

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // Destroy logic could be here
} else {
    importData();
}
