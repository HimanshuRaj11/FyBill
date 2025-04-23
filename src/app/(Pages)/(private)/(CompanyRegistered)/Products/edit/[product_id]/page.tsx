'use client'
import React from 'react'

export default function Page({ params }: { params: Promise<{ product_id: string }> }) {
    const { product_id } = React.use(params);

    const fetchProduct = async () => {
        try {

        } catch (error) {

        }
    }

    return (
        <div></div>
    )
}
