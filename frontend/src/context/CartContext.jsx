import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cartItems');
        return localData ? JSON.parse(localData) : [];
    });

    const [shippingAddress, setShippingAddress] = useState(() => {
        const localData = localStorage.getItem('shippingAddress');
        return localData ? JSON.parse(localData) : {
            address: '',
            city: '',
            postalCode: '',
            country: '',
            contactNumber: '',
        };
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }, [shippingAddress]);

    const addToCart = (product, qty) => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find((x) => x._id === product._id);

            if (existItem) {
                return prevItems.map((x) =>
                    x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
                );
            } else {
                return [...prevItems, { ...product, qty }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
    };

    const updateQty = (id, qty) => {
        setCartItems((prevItems) =>
            prevItems.map((x) => (x._id === id ? { ...x, qty } : x))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                shippingAddress,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                saveShippingAddress,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
