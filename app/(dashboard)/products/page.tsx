"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/products/ProductColumns";

const Products = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);

  const getProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "GET",
      });
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.log("[products_GET]", err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-light text-[#2a2a2a] tracking-wider">
          PRODUCTS
        </h1>
        <Button
          className="bg-[#2a2a2a] text-white hover:bg-[#1a1a1a] rounded-none px-6 py-4 text-xs tracking-widest uppercase transition-all duration-300"
          onClick={() => router.push("/products/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          CREATE PRODUCT
        </Button>
      </div>
      <Separator className="bg-[#b89d7a] h-px my-6" />
      <DataTable 
        columns={columns} 
        data={products} 
        searchKey="title"
      />
    </div>
  );
};

export default Products;