import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IoClose } from "react-icons/io5";
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import uploadImage from '../utils/UploadImage';

const UploadCategoryModel = ({ close, fetchData }) => {
    const [categoryData, setCategoryData] = useState({
        name: "",
        image: ""
    });
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false); // Track image upload state

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setCategoryData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.addCategory,
                data: categoryData
            });
            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                close();
                fetchData();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            setImageLoading(true);

            // Log the start of the image upload process
            console.log('Uploading image...', file);

            const response = await uploadImage(file);
            
            // Log the response to see if it contains the expected structure
            console.log('Upload image response:', response);

            // Check if response is valid and contains the 'data' property
            if (response && response.data) {
                const { data: imageResponse } = response;

                // Log the image URL to confirm it's being set correctly
                console.log('Image uploaded successfully, URL:', imageResponse.data.url);

                setCategoryData((prev) => ({
                    ...prev,
                    image: imageResponse.data.url
                }));
            } else {
                throw new Error('Image upload failed, no valid response.');
            }
        } catch (error) {
            toast.error('Image upload failed.');
            console.error('Image upload error:', error);
        } finally {
            setImageLoading(false);
        }
    };

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center'>
            <div className='bg-white max-w-4xl w-full p-4 rounded'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold'>Category</h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label id='categoryName'>Name</label>
                        <input
                            type='text'
                            id='categoryName'
                            placeholder='Enter category name'
                            value={categoryData.name}
                            name='name'
                            onChange={handleOnChange}
                            className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                                {categoryData.image ? (
                                    <img
                                        alt='category'
                                        src={categoryData.image}
                                        className='w-full h-full object-scale-down'
                                    />
                                ) : (
                                    <p className='text-sm text-neutral-500'>No Image</p>
                                )}
                            </div>
                            <label htmlFor='uploadCategoryImage'>
                                <div
                                    className={`${
                                        !categoryData.name ? "bg-gray-300" : "border-primary-200 hover:bg-primary-100"
                                    } px-4 py-2 rounded cursor-pointer border font-medium`}>
                                    {imageLoading ? 'Uploading...' : 'Upload Image'}
                                </div>

                                <input
                                    disabled={!categoryData.name}
                                    onChange={handleUploadCategoryImage}
                                    type='file'
                                    id='uploadCategoryImage'
                                    className='hidden'
                                />
                            </label>
                        </div>
                    </div>

                    <button
                        className={`${
                            categoryData.name && categoryData.image
                                ? "bg-primary-200 hover:bg-primary-100"
                                : "bg-gray-300"
                        } py-2 font-semibold`}
                        disabled={loading || !categoryData.name || !categoryData.image}
                    >
                        {loading ? 'Adding Category...' : 'Add Category'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default UploadCategoryModel;