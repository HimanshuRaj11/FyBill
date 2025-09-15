import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ProductSpecification = [
    "Spicy",
    "Extra spicy ",
    "Super spicy ",
    "Medium spicy ",
    "Little spicy",
    "Mild",
    "Gravy",
    "Dry",
    "Semi Gravy",
    "Extra Roasted",
    "no pepper",
    "less oil",
    "takeaway"

]

export default function BillProductEdit({ setEditProductPopUp, editProduct, setProducts, }: { setEditProductPopUp: any, editProduct: any, setProducts: any }) {
    const { product, index } = editProduct

    const [name, setName] = useState(product.name);
    const [rate, setRate] = useState(product.rate);
    const [quantity, setQuantity] = useState(product.quantity);
    const [Specification, setSpecification] = useState(product.Specification)
    const amount = rate * quantity

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProducts((preVal: any) => {
            const updatedProducts = [...preVal];
            updatedProducts[index] = { ...updatedProducts[index], name, rate, amount, quantity, Specification };
            return updatedProducts;
        });
        setEditProductPopUp(false)
        setName(product.name)
        setRate(product.rate)
        setQuantity(product.quantity)
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
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium">Specification</label>
                    <Select onValueChange={setSpecification}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Specification" />
                        </SelectTrigger>
                        <SelectContent>
                            {ProductSpecification.map((Specification: string, index: number) => (
                                <SelectItem key={index + 1} value={Specification}>
                                    {Specification}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 mt-1.5 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}