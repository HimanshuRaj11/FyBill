"use client";
import { CreditCard, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface CustomerPanelProps {
    clientName: string;
    setClientName: (v: string) => void;
    phoneNumber: string;
    setPhoneNumber: (v: string) => void;
    BillType: string;
    setBillType: (v: string) => void;
    isExempted: boolean;
    setIsExempted: (v: boolean) => void;
    paymentMode: string;
    setPaymentMode: (v: string) => void;
    discountType: string;
    setDiscountType: (v: string) => void;
    discountValue: number;
    setDiscountValue: (v: number) => void;
    selectedBranch: string;
    setSelectedBranch: (v: string) => void;
    HoldedInvoice: string;
    // redux selectors
    userRole: string;
    branches: any[];
    currencySymbol: string;
}

export default function CustomerPanel({
    clientName,
    setClientName,
    phoneNumber,
    setPhoneNumber,
    BillType,
    setBillType,
    isExempted,
    setIsExempted,
    paymentMode,
    setPaymentMode,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    selectedBranch,
    setSelectedBranch,
    HoldedInvoice,
    userRole,
    branches,
}: CustomerPanelProps) {
    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <UserIcon className="h-5 w-5" /> Customer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Name */}
                <Input
                    placeholder="Customer Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                />

                {/* Phone */}
                <Input
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                {/* Branch selector (Owner only) */}
                {userRole === "Owner" && branches?.length > 0 && !HoldedInvoice && (
                    <Select onValueChange={setSelectedBranch} value={selectedBranch}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map((b: any) => (
                                <SelectItem key={b._id} value={b._id}>
                                    {b.branchName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Bill type radio */}
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="radio"
                            checked={BillType === "BILL"}
                            onChange={() => setBillType("BILL")}
                        />
                        Bill
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="radio"
                            checked={BillType === "KOT"}
                            onChange={() => setBillType("KOT")}
                        />
                        KOT
                    </label>
                </div>

                {/* Exempted */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isExempted}
                        onChange={(e) => setIsExempted(e.target.checked)}
                    />
                    Exempted
                </label>

                {/* Payment mode (not KOT) */}
                {BillType !== "KOT" && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Payment Mode</label>
                        <div className="relative">
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
                                <option value="cheque">Cheque</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Discount */}
                <div className="pt-4 border-t space-y-2">
                    <label className="text-sm font-medium">Discount</label>
                    <div className="flex gap-2">
                        <Button
                            variant={discountType === "percentage" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDiscountType("percentage")}
                        >
                            %
                        </Button>
                        <Button
                            variant={discountType === "value" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDiscountType("value")}
                        >
                            Flat
                        </Button>
                    </div>
                    <Input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                    />
                </div>
            </CardContent>
        </Card>
    );
}