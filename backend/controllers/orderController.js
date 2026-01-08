const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    console.log('POST /api/orders hit');
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        console.error('No order items');
        res.status(400);
        throw new Error('No order items');
    } else if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
        res.status(400);
        throw new Error('Please provide a complete shipping address');
    } else {
        console.log('Creating Stripe session...');
        try {
            // Create Stripe checkout session
            const line_items = orderItems.map((item) => {
                const itemData = {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: Math.round(item.price * 100), // Ensure it's an integer
                    },
                    quantity: item.qty,
                };

                // Only add images if they are valid public URLs (not localhost)
                if (item.image &&
                    (item.image.startsWith('http') || item.image.startsWith('https')) &&
                    !item.image.includes('localhost')) {
                    itemData.price_data.product_data.images = [item.image];
                }

                return itemData;
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/profile?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/cart?canceled=true`,
                customer_email: req.user.email,
                metadata: {
                    user_id: req.user._id.toString(),
                },
            });
            console.log('Saving order to DB...');

            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentResult: {
                    id: session.id,
                    status: 'pending',
                }
            });

            const createdOrder = await order.save();

            res.status(201).json({ order: createdOrder, url: session.url });
        } catch (error) {
            console.error('Checkout Error:', error.message);
            res.status(500).json({
                message: error.message || 'Server Error during checkout',
                stack: process.env.NODE_ENV === 'production' ? null : error.stack
            });
        }
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        // order.paymentResult = { ... } // Already set during creation, or update if needed

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Verify Stripe payment and update order
// @route   PUT /api/orders/verify-payment
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { session_id } = req.body;

    if (!session_id) {
        res.status(400);
        throw new Error('Session ID is required');
    }

    const order = await Order.findOne({ 'paymentResult.id': session_id });

    if (order) {
        if (order.isPaid) {
            res.json(order); // Already paid
            return;
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult.status = 'completed'; // Update status to completed

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    verifyPayment,
};
