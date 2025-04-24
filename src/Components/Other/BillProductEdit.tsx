import React, { useState } from 'react';

export default function BillProductEdit({ setEditProductPopUp, editProduct, setProducts }: { setEditProductPopUp: any, editProduct: any, setProducts: any, }) {
    const { product, index } = editProduct

    const [name, setName] = useState(product.name);
    const [rate, setRate] = useState(product.rate);
    const [quantity, setQuantity] = useState(product.quantity);
    const amount = rate * quantity
    // console.log(product);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProducts((preVal: any) => {
            const updatedProducts = [...preVal];
            updatedProducts[index] = { ...updatedProducts[index], name, rate, amount, quantity };
            return updatedProducts;
        });
        setEditProductPopUp(false)
        setName(product.name)
        setRate(product.rate)
        setQuantity(product.quantity)

        // Handle form submission logic here
    };

    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Rate</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}