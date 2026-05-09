"use client";
import { useRef } from "react";
import { Search, X, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ProductCardSkeleton from "@/Components/Skeleton/ProductCardCreateBill";
import { ComplementProduct } from "./useBilling";

interface ProductPanelProps {
    productName: string;
    handleProductSearch: (term: string) => void;
    ClearSearch: () => void;
    filteredProducts: any[];
    productCategories: string[];
    selectedCategory: string;
    handleCategoryChange: (cat: string) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    AddProduct: (p: any) => void;
    ProductIsLoading: boolean;
    highlightedIndex: number;
    itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    searchRef: React.RefObject<HTMLInputElement>;
    currencySymbol: string;
}

export default function ProductPanel({
    productName,
    handleProductSearch,
    ClearSearch,
    filteredProducts,
    productCategories,
    selectedCategory,
    handleCategoryChange,
    activeTab,
    setActiveTab,
    AddProduct,
    ProductIsLoading,
    highlightedIndex,
    itemRefs,
    searchRef,
    currencySymbol,
}: ProductPanelProps) {
    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-xl">Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="products">Products</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>

                    {/* ── Products tab ── */}
                    <TabsContent value="products" className="space-y-4">
                        {/* Search input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                ref={searchRef}
                                placeholder="Search Products (↑ ↓ Enter)"
                                value={productName}
                                onChange={(e) => handleProductSearch(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            {productName && (
                                <X
                                    onClick={ClearSearch}
                                    className="absolute right-3 top-2 cursor-pointer text-gray-400 hover:text-gray-600"
                                />
                            )}
                        </div>

                        {/* Active category pill */}
                        {selectedCategory !== "all" && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Filtered by:</span>
                                <Badge
                                    variant="secondary"
                                    className="capitalize cursor-pointer"
                                    onClick={() => handleCategoryChange("all")}
                                >
                                    {selectedCategory} ✕
                                </Badge>
                            </div>
                        )}

                        {/* Product grid */}
                        <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[380px] pr-1">
                            {/* Complement card */}
                            <div
                                onClick={() => AddProduct(ComplementProduct)}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-950 border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                            >
                                <PlusCircle className="h-8 w-8 text-blue-500" />
                                <span className="text-sm font-medium">Complement</span>
                                <span className="text-xs text-gray-500">{currencySymbol}0.00</span>
                            </div>

                            {/* Loading skeletons */}
                            {ProductIsLoading &&
                                [...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}

                            {/* Product cards */}
                            {!ProductIsLoading &&
                                filteredProducts.map((product: any, index: number) => (
                                    <div
                                        key={index}
                                        ref={(el: any) => (itemRefs.current[index + 1] = el)}
                                        onClick={() => AddProduct(product)}
                                        className={`bg-white hover:bg-blue-50 border dark:bg-gray-950 rounded-lg p-2 shadow-sm hover:shadow cursor-pointer transition-all ${index + 1 === highlightedIndex
                                            ? "border-blue-600 bg-blue-50"
                                            : ""
                                            }`}
                                    >
                                        <div className="flex flex-row items-center gap-1">
                                            {product?.product_number && (
                                                <h4 className="font-medium px-2 bg-amber-500 w-fit h-8 rounded-full border flex justify-center items-center text-sm">
                                                    {product.product_number}
                                                </h4>
                                            )}
                                            <h3 className="font-medium text-sm">{product.name}</h3>
                                        </div>
                                        <p className="text-blue-600 font-semibold mt-1 text-sm">
                                            {currencySymbol}{product.price.toFixed(2)}
                                        </p>
                                        {product.category && (
                                            <Badge variant="outline" className="mt-2 text-xs">
                                                {product.category}
                                            </Badge>
                                        )}
                                    </div>
                                ))}

                            {/* Empty state */}
                            {!ProductIsLoading && filteredProducts.length === 0 && (
                                <div className="col-span-2 text-center py-8 text-gray-400 text-sm">
                                    No products found
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ── Categories tab ── */}
                    <TabsContent value="categories">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[430px]">
                            {productCategories.map((category, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        handleCategoryChange(category);
                                        setActiveTab("products");
                                    }}
                                    className={`border rounded-lg p-3 dark:bg-gray-950 cursor-pointer transition-all flex items-center justify-center text-center ${selectedCategory === category
                                        ? "bg-blue-100 border-blue-300"
                                        : "bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="font-medium capitalize">
                                        {category === "uncategorized" ? "Other" : category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}