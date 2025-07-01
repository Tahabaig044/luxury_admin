"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(500).trim(),
  image: z.string(),
});

interface CollectionFormProps {
  initialData?: CollectionType | null;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? initialData : {
      title: "",
      description: "",
      image: "",
    },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData 
        ? `/api/collections/${initialData._id}`
        : "/api/collections";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      
      if (res.ok) {
        toast.success(`Collection ${initialData ? "updated" : "created"} successfully`, {
          style: {
            background: '#f8f3ed',
            color: '#2a2a2a',
            border: '1px solid #b89d7a',
            padding: '16px',
            fontSize: '14px'
          },
          iconTheme: {
            primary: '#b89d7a',
            secondary: '#f8f3ed',
          },
        });
        router.push("/collections");
        router.refresh();
      }
    } catch (err) {
      console.log("[collections_POST]", err);
      toast.error("Something went wrong! Please try again.", {
        style: {
          background: '#f8f3ed',
          color: '#d94a4a',
          border: '1px solid #d94a4a',
          padding: '16px',
          fontSize: '14px'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="mb-10">
        <button 
          onClick={() => router.push("/collections")} 
          className="flex items-center text-[#b89d7a] hover:text-[#9c8360] transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm tracking-widest">BACK TO COLLECTIONS</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif font-light text-[#2a2a2a] tracking-wider">
            {initialData ? "EDIT COLLECTION" : "CREATE NEW COLLECTION"}
          </h1>
          {initialData && (
            <Delete 
              id={initialData._id} 
              item="collection" 
            />
          )}
        </div>
        <Separator className="bg-[#b89d7a] h-px mt-2 w-32" />
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-500 tracking-widest uppercase">
                  Collection Title
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Enter collection title" 
                      {...field} 
                      onKeyDown={handleKeyPress}
                      className="border-0 border-b border-gray-300 focus:border-[#b89d7a] focus:ring-0 rounded-none py-4 px-0 text-lg font-light tracking-wider"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-[#b89d7a] transition-all duration-300 group-focus-within:w-full"></div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-500 tracking-widest uppercase">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter collection description" 
                    {...field} 
                    rows={5} 
                    onKeyDown={handleKeyPress}
                    className="border border-gray-300 focus:border-[#b89d7a] focus:ring-[#b89d7a] rounded-sm py-3 px-4 font-light tracking-wider"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />

          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-500 tracking-widest uppercase">
                  Collection Image
                </FormLabel>
                <FormControl>
                  <div className="border border-gray-300 p-6 rounded-sm hover:border-[#b89d7a] transition-colors">
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className="flex flex-col lg:flex-row gap-6 pt-10 border-t border-gray-200">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#2a2a2a] text-white hover:bg-[#1a1a1a] rounded-none px-10 py-5 text-xs tracking-widest transition-all duration-300 uppercase flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing</span>
                </>
              ) : (
                initialData ? "Update Collection" : "Create Collection"
              )}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/collections")}
              className="bg-transparent text-[#2a2a2a] border border-[#2a2a2a] hover:bg-[#f8f3ed] rounded-none px-10 py-5 text-xs tracking-widest transition-colors duration-300 uppercase"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;