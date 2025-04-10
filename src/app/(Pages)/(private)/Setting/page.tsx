'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { toast } from 'react-toastify';

interface Tax {
    taxName: string;
    percentage: number;
}

export default function SettingsPage() {
    const [taxes, setTaxes] = useState<Tax[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [editTaxMode, setEditTaxMode] = useState(false);
    const [editCategoryMode, setEditCategoryMode] = useState(false);
    const [newTax, setNewTax] = useState({ taxName: '', percentage: 0 });
    const [newCategory, setNewCategory] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [taxesRes, categoriesRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Tax/fetch`),
                    axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Product_category/fetch`)
                ]);


                setTaxes(taxesRes.data.tax.taxes);

                setCategories(categoriesRes.data.category.category);
            } catch (error) {
                toast.error('Failed to load settings');
            }
        };
        fetchData();
    }, []);

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

    const handleUpdateTax = async (index: number, updatedTax: Tax) => {
        try {
            setLoading(true);
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/tax/update`, updatedTax);
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

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-8">
                {/* Taxes Section */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Tax Settings</h2>
                        <div className="flex items-center gap-2">
                            <span>Edit Taxes</span>
                            <Switch
                                checked={editTaxMode}
                                onCheckedChange={(checked) => {
                                    setEditTaxMode(checked);
                                    if (checked) setEditCategoryMode(false);
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {taxes?.map((tax, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <Input
                                    value={tax.taxName}
                                    onChange={(e) => handleUpdateTax(index, { ...tax, taxName: e.target.value })}
                                    className="w-1/2"
                                    disabled={!editTaxMode}
                                />
                                <Input
                                    type="number"
                                    value={tax.percentage}
                                    onChange={(e) => handleUpdateTax(index, { ...tax, percentage: Number(e.target.value) })}
                                    className="w-1/4"
                                    disabled={!editTaxMode}
                                />
                                {editTaxMode && (
                                    <>
                                        <Button onClick={() => handleUpdateTax(index, tax)} size="sm">
                                            Update
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                            Remove
                                        </Button>
                                    </>
                                )}
                            </div>
                        ))}
                        {editTaxMode && (
                            <div className="flex items-center gap-4 mt-4">
                                <Input
                                    placeholder="Tax Name"
                                    value={newTax.taxName}
                                    onChange={(e) => setNewTax({ ...newTax, taxName: e.target.value })}
                                    className="w-1/2"
                                />
                                <Input
                                    type="number"
                                    placeholder="Percentage"
                                    value={newTax.percentage}
                                    onChange={(e) => setNewTax({ ...newTax, percentage: Number(e.target.value) })}
                                    className="w-1/4"
                                />
                                <Button onClick={handleAddTax} disabled={loading}>
                                    Add Tax
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Categories Section */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Categories</h2>
                        <div className="flex items-center gap-2">
                            <span>Edit Categories</span>
                            <Switch
                                checked={editCategoryMode}
                                onCheckedChange={(checked) => {
                                    setEditCategoryMode(checked);
                                    if (checked) setEditTaxMode(false);
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {categories?.map((cat, index) => (
                            <div key={index} className="flex items-center gap-4" >
                                <Input
                                    value={cat}
                                    onChange={(e) => handleUpdateCategory(index, e.target.value)}
                                    className="w-3/4"
                                    disabled={!editCategoryMode}
                                />
                                {editCategoryMode && (
                                    <>
                                        <Button onClick={() => handleUpdateCategory(index, cat)} size="sm">
                                            Update
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                            Remove
                                        </Button>
                                    </>
                                )}
                            </div>
                        ))}
                        {editCategoryMode && (
                            <div className="flex items-center gap-4 mt-4">
                                <Input
                                    placeholder="New Category"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-3/4"
                                />
                                <Button onClick={handleAddCategory} disabled={loading}>
                                    Add Category
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            </div >
        </div >
    );
}
