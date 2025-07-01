"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import Delete from "../custom ui/Delete";
import MultiText from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";
import Loader from "../custom ui/Loader";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(10).max(1000).trim(),
  media: z.array(z.string()).min(1, "At least one image is required"),
  category: z.string().min(2),
  collections: z.array(z.string()),
  tags: z.array(z.string()),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  price: z.coerce.number().min(0.1),
  expense: z.coerce.number().min(0.1),
});

interface ProductFormProps {
  initialData?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);

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
      toast.error("Failed to load collections");
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          collections: initialData.collections.map((c) => c._id),
        }
      : {
          title: "",
          description: "",
          media: [],
          category: "",
          collections: [],
          tags: [],
          sizes: [],
          colors: [],
          price: 0.1,
          expense: 0.1,
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success(`Product ${initialData ? "updated" : "created"}`, {
          style: {
            background: '#f8f3ed',
            color: '#2a2a2a',
            border: '1px solid #b89d7a'
          }
        });
        router.push("/products");
        router.refresh();
      }
    } catch (err) {
      console.log("[products_POST]", err);
      toast.error("Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Header */}
      <div className="mb-10">
        <button 
          onClick={() => router.push("/products")} 
          className="flex items-center text-[#b89d7a] hover:text-[#9c8360] mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="text-sm tracking-widest">BACK TO PRODUCTS</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif font-light text-[#2a2a2a] tracking-wider">
            {initialData ? "EDIT PRODUCT" : "CREATE NEW PRODUCT"}
          </h1>
          {initialData && <Delete id={initialData._id} item="product" />}
        </div>
        <Separator className="bg-[#b89d7a] h-px mt-2 w-32" />
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Basic Info Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                    Product Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product title"
                      {...field}
                      className="border-gray-300 focus:border-[#b89d7a] rounded-none py-4 focus-visible:ring-offset-0 focus-visible:ring-[#b89d7a]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                    Category
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category"
                      {...field}
                      className="border-gray-300 focus:border-[#b89d7a] rounded-none py-4 focus-visible:ring-offset-0 focus-visible:ring-[#b89d7a]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter detailed product description"
                    {...field}
                    rows={6}
                    className="border-gray-300 focus:border-[#b89d7a] rounded-none focus-visible:ring-offset-0 focus-visible:ring-[#b89d7a]"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          {/* Media Section */}
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                  Product Images
                </FormLabel>
                <FormControl>
                  <div className="border border-gray-300 p-6 rounded-sm">
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => field.onChange([...field.value, url])}
                      onRemove={(url) =>
                        field.onChange(field.value.filter((img) => img !== url))
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          {/* Pricing Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                    Price ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="border-gray-300 focus:border-[#b89d7a] rounded-none py-4 focus-visible:ring-offset-0 focus-visible:ring-[#b89d7a]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                    Cost ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="border-gray-300 focus:border-[#b89d7a] rounded-none py-4 focus-visible:ring-offset-0 focus-visible:ring-[#b89d7a]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Variants Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                    Colors
                  </FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Add color variants"
                      value={field.value}
                      onChange={(color) => field.onChange([...field.value, color])}
                      onRemove={(color) =>
                        field.onChange(field.value.filter((c) => c !== color))
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                    Sizes
                  </FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Add size variants"
                      value={field.value}
                      onChange={(size) => field.onChange([...field.value, size])}
                      onRemove={(size) =>
                        field.onChange(field.value.filter((s) => s !== size))
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Collections & Tags */}
          <div className="grid md:grid-cols-2 gap-8">
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                      Collections
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Select collections"
                        collections={collections}
                        value={field.value}
                        onChange={(_id) => field.onChange([...field.value, _id])}
                        onRemove={(id) =>
                          field.onChange(field.value.filter((c) => c !== id))
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-gray-600 tracking-widest uppercase">
                    Tags
                  </FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Add product tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tag) =>
                        field.onChange(field.value.filter((t) => t !== tag))
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col lg:flex-row gap-6 pt-10 border-t border-gray-200">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#2a2a2a] text-white hover:bg-[#1a1a1a] rounded-none px-10 py-5 text-xs tracking-widest uppercase transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  PROCESSING
                </>
              ) : initialData ? (
                "UPDATE PRODUCT"
              ) : (
                "CREATE PRODUCT"
              )}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/products")}
              className="bg-transparent text-[#2a2a2a] border border-[#2a2a2a] hover:bg-[#f8f3ed] rounded-none px-10 py-5 text-xs tracking-widest uppercase transition-all duration-300"
            >
              CANCEL
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;