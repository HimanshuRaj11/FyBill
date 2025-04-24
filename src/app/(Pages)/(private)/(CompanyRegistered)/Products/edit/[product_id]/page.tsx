'use client'
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'

export default function Page({ params }: { params: Promise<{ product_id: string }> }) {
    const { product_id } = React.use(params);
    const [ProductDetails, setProductsDetails] = useState()

    const fetchProduct = useCallback(async () => {
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetchProductById`, product_id)
            console.log(data);

        } catch (error) {

        }
    }, [product_id])
    useEffect(() => {
        fetchProduct()
    }, [fetchProduct])

    return (
        <div></div>
    )
}
