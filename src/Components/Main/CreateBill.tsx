import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Product {
    name: string;
    rate: number;
    quantity: number;
    amount: number;
}

export default function BillingComponent({ setCreateBill, ShowInvoice, setShowInvoice }: { setCreateBill: any, ShowInvoice: any, setShowInvoice: any }) {
    const [clientName, setClientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [productName, setProductName] = useState("");
    const [rate, setRate] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);


    const handleAddProduct = () => {
        const newProduct: Product = {
            name: productName,
            rate,
            quantity,
            amount: rate * quantity,
        };

        if (editIndex !== null) {
            const updated = [...products];
            updated[editIndex] = newProduct;
            setProducts(updated);
            setEditIndex(null);
        } else {
            setProducts([...products, newProduct]);
        }

        setProductName("");
        setRate(0);
        setQuantity(0);
    };

    const handleDelete = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleEdit = (index: number) => {
        const product = products[index];
        setProductName(product.name);
        setRate(product.rate);
        setQuantity(product.quantity);
        setEditIndex(index);
    };

    const OnContinue = () => {
        setCreateBill(false)
        setShowInvoice(true)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-2xl ">
            <h1 className="text-2xl font-bold mb-4">Create Bill</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                    placeholder="Client Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                />
                <Input
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
                <Input
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <div>
                    <label className="block text-sm font-medium mb-1">Rate</label>
                    <Input
                        type="number"
                        placeholder="Rate"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <Input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>
                <Button onClick={handleAddProduct} className="w-full cursor-pointer">
                    {editIndex !== null ? "Update Product" : "Add Product"}
                </Button>
            </div>
            <table className="w-full border mt-6 text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Product Name</th>
                        <th className="p-2">Rate</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index} className="border-t">
                            <td className="p-2">{product.name}</td>
                            <td className="p-2">₹{product.rate}</td>
                            <td className="p-2">{product.quantity}</td>
                            <td className="p-2">₹{product.amount}</td>
                            <td className="p-2 space-x-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(index)}>
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(index)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end my-4">
                <Button onClick={OnContinue} className="cursor-pointer w-full">Continue</Button>
            </div>

        </div>
    );
}