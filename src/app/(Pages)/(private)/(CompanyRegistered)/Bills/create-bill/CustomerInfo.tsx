'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { CreditCard, Percent, Phone, UserIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

export default function CustomerInfo() {
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company);

    const [clientName, setClientName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [BillType, setBillType] = useState<string>("BILL");
    const [isExempted, setIsExempted] = useState<boolean>(false);
    const [paymentMode, setPaymentMode] = useState<string>("cash");
    const [discountType, setDiscountType] = useState<string>("percentage");
    const [discountValue, setDiscountValue] = useState<number | "">("");
    const [HoldedInvoice, setHoldedInvoice] = useState<any>(null);



    return (
        <div>
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <UserIcon className="h-5 w-5" /> Customer Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Customer Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Customer Name"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {User?.role === "Owner" && Company?.branch?.length > 0 && !HoldedInvoice && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Branch</label>
                                <Select onValueChange={setSelectedBranch}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Company?.branch?.map((branch: any) => (
                                            <SelectItem key={branch._id} value={branch._id}>
                                                {branch.branchName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Bill Type</label>
                            <div className="flex gap-4 mt-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="bill-type-bill"
                                        name="billType"
                                        value="BILL"
                                        checked={BillType === "BILL"}
                                        onChange={(e) => setBillType(e.target.value)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="bill-type-bill">Bill</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="bill-type-kot"
                                        name="billType"
                                        value="KOT"
                                        checked={BillType === "KOT"}
                                        onChange={(e) => setBillType(e.target.value)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="bill-type-kot">KOT</label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">EXEMPTED</label>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    id="exempted"
                                    type="checkbox"
                                    checked={isExempted}
                                    onChange={(e) => setIsExempted(e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <label htmlFor="exempted" className="text-sm">EXEMPTED</label>
                            </div>
                        </div>


                        {BillType !== "KOT" && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Payment Mode</label>
                                <div className="relative ">
                                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <select
                                        className="w-full dark:bg-gray-950 p-2 pl-10 border rounded-md bg-white appearance-none"
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        value={paymentMode}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="upi">UPI</option>
                                        <option value="card">Card</option>
                                        <option value="netBanking">Net Banking</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Discount Section */}
                        <div className="space-y-3 pt-4 border-t border-gray-200">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Percent className="h-4 w-4" />
                                Discount
                            </label>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-600">Discount Type</label>
                                    <div className="flex gap-4">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="discount-type-percentage"
                                                name="discountType"
                                                value="percentage"
                                                checked={discountType === "percentage"}
                                                onChange={(e) => setDiscountType(e.target.value)}
                                                className="mr-2"
                                            />
                                            <label htmlFor="discount-type-percentage" className="text-sm">Percentage (%)</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="discount-type-value"
                                                name="discountType"
                                                value="value"
                                                checked={discountType === "value"}
                                                onChange={(e) => setDiscountType(e.target.value)}
                                                className="mr-2"
                                            />
                                            <label htmlFor="discount-type-value" className="text-sm">Fixed Value</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-gray-600">
                                        Discount {discountType === "percentage" ? "Percentage" : "Amount"}
                                    </label>
                                    <div className="relative">
                                        {discountType === "percentage" ? (
                                            <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        ) : (
                                            <span className="absolute left-3 top-3 text-sm text-gray-400">{Company?.currency?.symbol}</span>
                                        )}
                                        <Input
                                            type="number"
                                            placeholder={
                                                discountType === "percentage"
                                                    ? "Enter percentage (0-100)"
                                                    : "Enter discount amount"
                                            }
                                            value={discountValue}
                                            onChange={(e) => {
                                                const raw = e.target.value;

                                                let value: number | "" = raw === "" ? "" : Number(raw);

                                                if (discountType === "percentage" && value !== "") {
                                                    if (value > 100) value = 100;
                                                    if (value < 0) value = 0;
                                                }
                                                setDiscountValue(value);
                                            }}
                                            className="pl-10"
                                            min={0}
                                            max={discountType === "percentage" ? 100 : undefined}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
