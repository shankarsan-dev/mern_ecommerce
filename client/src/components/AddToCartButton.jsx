import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const cartItem = useSelector((state) => state.cartItem.cart);
    const [isAvailableCart, setIsAvailableCart] = useState(false);
    const [qty, setQty] = useState(0);
    const [cartItemDetails, setCartItemsDetails] = useState(null);

    // Handle adding an item to the cart
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!data || !data._id) {
            toast.error("Invalid product data!");
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.addTocart,
                data: { productId: data._id },
            });

            if (response.data?.success) {
                toast.success(response.data.message);
                fetchCartItem && fetchCartItem();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    // Check if the item is in the cart
    useEffect(() => {
        if (!cartItem || !Array.isArray(cartItem) || cartItem.length === 0) {
            setIsAvailableCart(false);
            setQty(0);
            setCartItemsDetails(null);
            return;
        }

        const product = cartItem.find((item) => item?.productId?._id === data?._id);
        setIsAvailableCart(!!product);
        setQty(product?.quantity || 0);
        setCartItemsDetails(product || null);
    }, [data, cartItem]);

    // Increase item quantity
    const increaseQty = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!cartItemDetails?._id) return;

        const response = await updateCartItem(cartItemDetails._id, qty + 1);
        if (response.success) {
            toast.success("Item added");
        }
    };

    // Decrease item quantity or remove from cart
    const decreaseQty = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!cartItemDetails?._id) return;

        if (qty === 1) {
            await deleteCartItem(cartItemDetails._id);
        } else {
            const response = await updateCartItem(cartItemDetails._id, qty - 1);
            if (response.success) {
                toast.success("Item removed");
            }
        }
    };

    return (
        <div className="w-full max-w-[150px]">
            {isAvailableCart ? (
                <div className="flex w-full h-full">
                    <button
                        onClick={decreaseQty}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
                    >
                        <FaMinus />
                    </button>

                    <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
                        {qty}
                    </p>

                    <button
                        onClick={increaseQty}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
                    >
                        <FaPlus />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddToCart}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded"
                >
                    {loading ? <Loading /> : "Add"}
                </button>
            )}
        </div>
    );
};

export default AddToCartButton;
