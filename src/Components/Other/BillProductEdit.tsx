import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select';

const ProductSpecification = [
    "Spicy",
    "Extra spicy",
    "Super spicy",
    "Medium spicy",
    "Little spicy",
    "Mild",
    "Gravy",
    "Dry",
    "Semi Gravy",
    "Extra Roasted",
    "no pepper",
    "less oil",
    "takeaway"
];

export default function BillProductEdit({
    setEditProductPopUp,
    editProduct,
    setProducts,
}: {
    setEditProductPopUp: any;
    editProduct: any;
    setProducts: any;
}) {
    const { product, index } = editProduct;

    const [name, setName] = useState(product.name);
    const [rate, setRate] = useState(product.rate);
    const [quantity, setQuantity] = useState(product.quantity);
    const [Specification, setSpecification] = useState(product.Specification);
    const [isFree, setIsFree] = useState(product.amount === 0);

    /** ✅ Amount logic */
    const amount = isFree ? 0 : rate * quantity;

    /** Handle Free toggle (NAME ONLY) */
    useEffect(() => {
        if (isFree) {
            if (!name.toLowerCase().includes('(free)')) {
                setName((prev: any) => `${prev} (free)`);
            }
        } else {
            setName((prev: any) => prev.replace(/\s*\(free\)/i, ''));
        }
    }, [isFree]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setProducts((prev: any) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                name,
                rate,          // ✅ unchanged
                quantity,
                amount,        // ✅ only amount changes
                Specification,
            };
            return updated;
        });

        setEditProductPopUp(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full border rounded-md p-2"
                    />
                </div>

                {/* Rate */}
                <div>
                    <label className="block text-sm font-medium">Rate</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="mt-1 w-full border rounded-md p-2"
                    />
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-medium">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="mt-1 w-full border rounded-md p-2"
                    />
                </div>

                {/* Free Toggle */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isFree}
                        onChange={(e) => setIsFree(e.target.checked)}
                        className="h-4 w-4"
                    />
                    <label className="text-sm font-medium">
                        Mark item as Free
                    </label>
                </div>

                {/* Specification */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Specification</label>
                    <Select value={Specification} onValueChange={setSpecification}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Specification" />
                        </SelectTrigger>
                        <SelectContent>
                            {ProductSpecification.map((spec, idx) => (
                                <SelectItem key={idx} value={spec}>
                                    {spec}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Final Amount */}
                <div>
                    <label className="block text-sm font-medium">
                        Final Amount
                    </label>
                    <input
                        type="number"
                        value={amount}
                        readOnly
                        className="mt-1 w-full border rounded-md p-2 font-semibold"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 font-semibold py-2 rounded-md hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
