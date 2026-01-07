import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ProductEdit = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!productId;

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    // const [brand, setBrand] = useState(''); // Brand removed
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const userInfo = React.useMemo(() => JSON.parse(localStorage.getItem('userInfo')), []);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Set immediate preview
        setImagePreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            const data = await response.text();

            if (response.ok) {
                // The backend returns the path, e.g., "/uploads/file.jpg"
                // We typically store the relative path for portability or migration reasons.
                // But for display we need the full URL.
                setImage(data); // Store relative path from backend
                setUploading(false);
            } else {
                alert('File upload failed');
                setUploading(false);
            }
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('File upload failed');
        }
    };

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }

        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/products/${productId}`);
                    const data = await response.json();
                    if (response.ok) {
                        setName(data.name);
                        setPrice(data.price);
                        setImage(data.image);
                        // setBrand(data.brand);
                        setCategory(data.category);
                        setCountInStock(data.countInStock);
                        setDescription(data.description);
                    } else {
                        setError(data.message || 'Product not found');
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [productId, navigate, userInfo, isEditMode]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);

        const productData = {
            name,
            price,
            description,
            image,
            category,
            countInStock,
        };

        try {
            let url = 'http://localhost:5000/api/products';
            let method = 'POST';

            if (isEditMode) {
                url = `http://localhost:5000/api/products/${productId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify(productData),
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/admin/productlist');
            } else {
                alert(data.message || 'Failed to save product');
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdateLoading(false);
        }
    };

    // Helper to resolve display image
    const getDisplayImage = () => {
        if (imagePreview) return imagePreview;
        if (image) {
            return image.startsWith('http') ? image : `http://localhost:5000${image}`;
        }
        return null;
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                <Link to="/admin/productlist" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">{isEditMode ? 'Edit Product' : 'Add Product'}</h1>

                {loading ? (
                    <div className="flex justify-center">
                        <Loader2 className="animate-spin h-10 w-10 text-primary-600" />
                    </div>
                ) : error ? (
                    <div className="text-red-600 bg-red-50 p-4 rounded-md">{error}</div>
                ) : (
                    <div className="bg-white shadow-md rounded-xl p-8">
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Enter price"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    {getDisplayImage() && (
                                        <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                            <img
                                                src={getDisplayImage()}
                                                alt="Product preview"
                                                className="h-full w-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={uploadFileHandler}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer file:cursor-pointer"
                                    />
                                </div>
                                {uploading && <Loader2 className="animate-spin h-5 w-5 text-primary-600 mt-2" />}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Enter category"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Count In Stock</label>
                                <input
                                    type="number"
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Enter stock count"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Enter description"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updateLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer disabled:opacity-50"
                            >
                                {updateLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
                                {isEditMode ? 'Update Product' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProductEdit;
