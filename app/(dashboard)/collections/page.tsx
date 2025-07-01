"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "@/components/collections/CollectionColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/custom ui/Loader";

const Collections = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-light text-[#2a2a2a] tracking-wider">
          COLLECTIONS
        </h1>
        <Button
          className="bg-[#2a2a2a] text-white hover:bg-[#1a1a1a] rounded-none px-4 py-4 text-xs tracking-widest uppercase transition-all duration-300"
          onClick={() => router.push("/collections/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          CREATE COLLECTION
        </Button>
      </div>
      
      {/* Divider */}
      <Separator className="bg-[#b89d7a] h-px my-6" />
      
      {/* Data Table */}
      <DataTable 
        columns={columns} 
        data={collections} 
        searchKey="title"
      />
    </div>
  );
};

export default Collections;