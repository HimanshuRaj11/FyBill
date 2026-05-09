"use client";
import {
    Calendar,
    Edit,
    Minus,
    Plus,
    Receipt,
    Save,
    Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Product, AppliedTax } from "../useBilling";

interface BillSummaryProps {
    products: Product[];
    BillType: string;
    subTotal: number;
    grandTotal: number;
    appliedTaxes: AppliedTax[];
    discountValue: number;
    discountType: string;
    ProductDiscountValue: number;
    isExempted: boolean;
    isProcessing: boolean;
    currencySymbol: string;
    handleQuantityChange: (product: Product, delta: number) => void;
    handleDelete: (index: number) => void;
    handleProductEdit: (product: Product, index: number) => void;
    Reset: () => void;
    CreateInvoice: () => void;
    HoldInvoice: () => void;
    HandleKOT: () => void;
    paymentMode: string;
}

export default function BillSummary({
    products,
    BillType,
    subTotal,
    grandTotal,
    appliedTaxes,
    discountValue,
    discountType,
    ProductDiscountValue,
    isExempted,
    isProcessing,
    currencySymbol,
    handleQuantityChange,
    handleDelete,
    handleProductEdit,
    Reset,
    CreateInvoice,
    HoldInvoice,
    HandleKOT,
    paymentMode,
}: BillSummaryProps) {
    const totalTax = appliedTaxes.reduce((s, t) => s + t.amount, 0);
    const discountAmt =
        discountType === "percentage"
            ? Math.round(((subTotal + totalTax) * discountValue) / 100 / 50) * 50
            : discountValue;

    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" /> Bill Summary
                    </span>
                    {products.length > 0 && (
                        <Badge variant="secondary" className="px-2 py-1">
                            {products.length} {products.length === 1 ? "item" : "items"}
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {products.length === 0 ? (
                    <div className="text-center py-12 px-4 border border-dashed rounded-lg">
                        <Calendar className="h-12 w-12 mx-auto text-gray-300" />
                        <p className="mt-4 text-gray-500">No products added to the bill yet</p>
                    </div>
                ) : (
                    <>
                        {/* ── Product rows ── */}
                        <div className="max-h-[280px] pr-1 overflow-y-auto">
                            {products.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border-b py-3 relative"
                                >
                                    {/* Name & spec */}
                                    <div className="flex-1 min-w-0 mr-2">
                                        <p className="font-medium truncate">{product.name}</p>
                                        {product.Specification && (
                                            <p className="text-sm text-gray-500">({product.Specification})</p>
                                        )}
                                        {BillType !== "KOT" && (
                                            <p className="text-sm text-gray-500">
                                                {currencySymbol}{product.rate.toFixed(2)} each
                                            </p>
                                        )}
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-7 w-7 cursor-pointer rounded-full"
                                            onClick={() => handleQuantityChange(product, -1)}
                                        >
                                            <Minus className="size-4" />
                                        </Button>
                                        <span className="w-5 text-center text-sm">{product.quantity}</span>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-7 w-7 cursor-pointer rounded-full"
                                            onClick={() => handleQuantityChange(product, 1)}
                                        >
                                            <Plus className="size-4" />
                                        </Button>
                                    </div>

                                    {/* Amount + actions */}
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                        {BillType !== "KOT" && (
                                            <span className="text-right font-medium text-sm w-16">
                                                {currencySymbol}{product.amount.toFixed(2)}
                                            </span>
                                        )}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 cursor-pointer text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                            onClick={() => handleProductEdit(product, index)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Totals (not KOT) ── */}
                        {BillType !== "KOT" && (
                            <div className="space-y-3 pt-3 border-t text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>{currencySymbol}{subTotal.toFixed(2)}</span>
                                </div>

                                {appliedTaxes.map((tax, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span className="text-gray-600">
                                            {tax.taxName} ({tax.percentage}%)
                                        </span>
                                        <span>{currencySymbol}{tax.amount}</span>
                                    </div>
                                ))}

                                {isExempted && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">VAT (0%)</span>
                                        <span className="uppercase">Exempted</span>
                                    </div>
                                )}

                                {appliedTaxes.length > 0 && (
                                    <div className="flex justify-between border-t pt-2">
                                        <span>Total Tax</span>
                                        <span>+{currencySymbol}{totalTax.toFixed(2)}</span>
                                    </div>
                                )}

                                {discountValue > 0 && (
                                    <div className="flex justify-between border-t pt-2">
                                        <span>Discount</span>
                                        {discountType === "percentage" ? (
                                            <span className="text-right">
                                                -{discountValue.toFixed(2)}%<br />
                                                -{currencySymbol}{discountAmt.toFixed(2)}
                                            </span>
                                        ) : (
                                            <span>-{currencySymbol}{discountValue.toFixed(2)}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between border-t pt-3 text-base font-bold">
                                    <span>Grand Total</span>
                                    <span>
                                        {currencySymbol}
                                        {grandTotal.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>

                                {ProductDiscountValue > 0 && (
                                    <div className="flex justify-between border-t pt-2 text-green-600">
                                        <span>You Saved</span>
                                        <span>
                                            {currencySymbol}
                                            {ProductDiscountValue.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Action buttons ── */}
                        {BillType === "KOT" ? (
                            <div className="flex flex-col gap-2 pt-3">
                                <Button
                                    onClick={HandleKOT}
                                    variant="outline"
                                    disabled={products.length === 0 || isProcessing}
                                    className="cursor-pointer w-full py-5 text-base flex gap-2 items-center"
                                >
                                    <Save className="h-4 w-4" /> Continue
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 pt-3">
                                <Button
                                    onClick={CreateInvoice}
                                    disabled={
                                        products.length === 0 ||
                                        (BillType !== "KOT" && paymentMode === "") ||
                                        isProcessing
                                    }
                                    className="cursor-pointer w-full py-6 text-base"
                                >
                                    {isProcessing ? "Processing..." : "Create Invoice"}
                                </Button>
                                <Button
                                    onClick={HoldInvoice}
                                    variant="outline"
                                    disabled={products.length === 0 || isProcessing}
                                    className="cursor-pointer w-full py-5 text-base flex gap-2 items-center"
                                >
                                    <Save className="h-4 w-4" /> Hold Invoice
                                </Button>
                            </div>
                        )}

                        <span
                            className="text-red-500 text-sm cursor-pointer hover:underline"
                            onClick={Reset}
                        >
                            Reset
                        </span>
                    </>
                )}
            </CardContent>
        </Card>
    );
}