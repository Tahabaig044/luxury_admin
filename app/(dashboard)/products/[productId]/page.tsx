"use client"

import Loader from '@/components/custom ui/Loader'
import ProductForm from '@/components/products/ProductForm'
import React, { useEffect, useState } from 'react'

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  const [loading, setLoading] = useState(true)
  const [productDetails, setProductDetails] = useState<ProductType | null>(null)

  useEffect(() => {
    const getProductDetails = async () => {
      try { 
        const res = await fetch(`/api/products/${params.productId}`, {
          method: "GET"
        })
        const data = await res.json()
        setProductDetails(data)
      } catch (err) {
        console.log("[productId_GET]", err)
      } finally {
        setLoading(false)
      }
    }

    getProductDetails()
  }, [params.productId])

  return loading ? (
    <Loader />
  ) : (
    <ProductForm initialData={productDetails} />
  )
}

export default ProductDetails
