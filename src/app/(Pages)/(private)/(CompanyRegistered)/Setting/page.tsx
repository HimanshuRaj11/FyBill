'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { toast } from 'react-toastify';
import { worldCurrencies } from '@/lib/CurrencyData';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

interface Tax {
    _id?: string;
    taxName: string;
    percentage: number;
}

export default function SettingsPage() {
    const { Company } = useSelector((state: any) => state.Company);
    const company = Company?.company;

    const [taxes, setTaxes] = useState<Tax[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [currencySearch, setCurrencySearch] = useState('');
    const [filteredCurrencies, setFilteredCurrencies] = useState(worldCurrencies);

    const [loading, setLoading] = useState(false);
    const [editTaxMode, setEditTaxMode] = useState(false);
    const [editCategoryMode, setEditCategoryMode] = useState(false);
    const [editCurrencyMode, setEditCurrencyMode] = useState(false);
    const [newTax, setNewTax] = useState({ taxName: '', percentage: 0 });
    const [newCategory, setNewCategory] = useState('');
    const [editedTaxes, setEditedTaxes] = useState<Tax[]>([]);

    const [selectedCurrency, setSelectedCurrency] = useState({
        name: '',
        code: '',
        symbol: ''
    });

    const fetchData = async () => {
        try {
            const [taxesRes, categoriesRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/fetch`),
                axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Product_category/fetch`),
            ]);

            setTaxes(taxesRes.data.tax.taxes);
            setEditedTaxes(taxesRes.data.tax.taxes);
            setCategories(categoriesRes.data.category.category);
        } catch (error) {
            toast.error('Failed to load settings');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = worldCurrencies.filter(currency =>
            currency.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
            currency.code.toLowerCase().includes(currencySearch.toLowerCase())
        );
        setFilteredCurrencies(filtered);
    }, [currencySearch]);

    const handleAddTax = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/add`, newTax);
            if (res.data.success) {
                setTaxes([...taxes, newTax]);
                setNewTax({ taxName: '', percentage: 0 });
                toast.success('Tax added successfully');
            }
        } catch (error) {
            toast.error('Failed to add tax');
        } finally {
            setLoading(false);
        }
    };

    const handleTaxChange = (index: number, updatedTax: Tax) => {
        const newEditedTaxes = [...editedTaxes];
        newEditedTaxes[index] = updatedTax;
        setEditedTaxes(newEditedTaxes);
    };

    const handleUpdateTax = async (index: number) => {
        try {
            setLoading(true);
            const updatedTax = editedTaxes[index];
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/update`, updatedTax);
            if (res.data.success) {
                const updatedTaxes = [...taxes];
                updatedTaxes[index] = updatedTax;
                setTaxes(updatedTaxes);
                toast.success('Tax updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update tax');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTax = async (taxId: string | undefined) => {
        if (!taxId) return;
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/delete`, {
                taxId: taxId
            });
            if (res.data.success) {
                const updatedTaxes = taxes.filter((tax) => tax._id !== taxId);
                setTaxes(updatedTaxes);
                setEditedTaxes(updatedTaxes);
                toast.success('Tax deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete tax');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Product_category/add`, {
                categoryName: newCategory
            });
            if (res.data.success) {
                setCategories([...categories, newCategory]);
                setNewCategory('');
                toast.success('Category added successfully');
            }
        } catch (error) {
            toast.error('Failed to add category');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCategory = async (index: number, updatedCategory: string) => {
        try {
            setLoading(true);
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/category/update`, {
                category: updatedCategory
            });
            if (res.data.success) {
                const updatedCategories = [...categories];
                updatedCategories[index] = updatedCategory;
                setCategories(updatedCategories);
                toast.success('Category updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update category');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCurrency = async (currency: string) => {
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Currency`, {
                currency
            });
            if (res.data.success) {
                const currencyObj = worldCurrencies.find(c => c.code === currency);
                if (currencyObj) {
                    setSelectedCurrency(currencyObj);
                }
                toast.success('Currency updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update currency');
        } finally {
            setLoading(false);
            setEditCurrencyMode(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto p-6"
        >
            <h1 className="text-4xl font-bold mb-8 text-gray-800 border-b pb-4">Settings</h1>

            <div className="space-y-8">
                {/* Currency Section */}
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">Currency Settings</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600">Edit Currency</span>
                            <Switch
                                checked={editCurrencyMode}
                                onCheckedChange={(checked) => {
                                    setEditCurrencyMode(checked);
                                    if (checked) {
                                        setEditTaxMode(false);
                                        setEditCategoryMode(false);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className='flex items-center gap-3 bg-gray-50 p-4 rounded-lg'>
                        <h1 className='text-xl font-bold text-gray-700'>Current Currency:</h1>
                        <span className="text-blue-600">{company?.currency.name} - {company?.currency.code} - {company?.currency.symbol}</span>
                    </div>

                    {editCurrencyMode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4 mt-6"
                        >
                            <Input
                                placeholder="Search currency..."
                                value={currencySearch}
                                onChange={(e) => setCurrencySearch(e.target.value)}
                                className="w-full border-2 focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="max-h-60 overflow-y-auto rounded-lg border">
                                {filteredCurrencies.map((currency, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ backgroundColor: '#f3f4f6' }}
                                        className={`p-3 cursor-pointer border-b last:border-b-0 ${selectedCurrency.code === currency.code ? 'bg-blue-50' : ''}`}
                                        onClick={() => handleUpdateCurrency(currency as any)}
                                    >
                                        {currency.name} ({currency.code}) - {currency.symbol}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.section>

                {/* Taxes Section */}
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">Tax Settings</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600">Edit Taxes</span>
                            <Switch
                                checked={editTaxMode}
                                onCheckedChange={(checked) => {
                                    setEditTaxMode(checked);
                                    if (checked) {
                                        setEditCategoryMode(false);
                                        setEditCurrencyMode(false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {taxes?.map((tax, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                            >
                                <Input
                                    value={editedTaxes[index]?.taxName || tax.taxName}
                                    onChange={(e) => handleTaxChange(index, { ...editedTaxes[index], taxName: e.target.value })}
                                    className="w-1/2 border-2"
                                    disabled={!editTaxMode}
                                />
                                <Input
                                    type="number"
                                    value={editedTaxes[index]?.percentage || tax.percentage}
                                    onChange={(e) => handleTaxChange(index, { ...editedTaxes[index], percentage: Number(e.target.value) })}
                                    className="w-1/4 border-2"
                                    disabled={!editTaxMode}
                                />
                                {editTaxMode && (
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleUpdateTax(index)} size="sm" className="bg-blue-500 hover:bg-blue-600">
                                            Update
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteTax(tax._id)} className="bg-red-500 hover:bg-red-600">
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        {editTaxMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 mt-6 bg-blue-50 p-4 rounded-lg"
                            >
                                <Input
                                    placeholder="Tax Name"
                                    value={newTax.taxName}
                                    onChange={(e) => setNewTax({ ...newTax, taxName: e.target.value })}
                                    className="w-1/2 border-2"
                                />
                                <Input
                                    type="number"
                                    placeholder="Percentage"
                                    value={newTax.percentage}
                                    onChange={(e) => setNewTax({ ...newTax, percentage: Number(e.target.value) })}
                                    className="w-1/4 border-2"
                                />
                                <Button
                                    onClick={handleAddTax}
                                    disabled={loading}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Add Tax
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.section>

                {/* Categories Section */}
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-700">Categories</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600">Edit Categories</span>
                            <Switch
                                checked={editCategoryMode}
                                onCheckedChange={(checked) => {
                                    setEditCategoryMode(checked);
                                    if (checked) {
                                        setEditTaxMode(false);
                                        setEditCurrencyMode(false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {categories?.map((cat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                            >
                                <Input
                                    value={cat}
                                    onChange={(e) => handleUpdateCategory(index, e.target.value)}
                                    className="w-3/4 border-2"
                                    disabled={!editCategoryMode}
                                />
                                {editCategoryMode && (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleUpdateCategory(index, cat)}
                                            size="sm"
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="bg-red-500 hover:bg-red-600"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        {editCategoryMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 mt-6 bg-blue-50 p-4 rounded-lg"
                            >
                                <Input
                                    placeholder="New Category"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-3/4 border-2"
                                />
                                <Button
                                    onClick={handleAddCategory}
                                    disabled={loading}
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    Add Category
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
}
