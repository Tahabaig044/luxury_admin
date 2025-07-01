// import { DataTable } from "@/components/custom ui/DataTable"
// import { columns } from "@/components/orderItems/OrderItemsColums"

// const OrderDetails = async ({ params }: { params: { orderId: string }}) => {
//   const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`)
//   const { orderDetails, customer } = await res.json()

//   const { street, city, state, postalCode, country } = orderDetails.shippingAddress

//   return (
//     <div className="flex flex-col p-10 gap-5">
//       <p className="text-base-bold">
//         Order ID: <span className="text-base-medium">{orderDetails._id}</span>
//       </p>
//       <p className="text-base-bold">
//         Customer name: <span className="text-base-medium">{customer.name}</span>
//       </p>
//       <p className="text-base-bold">
//         Shipping address: <span className="text-base-medium">{street}, {city}, {state}, {postalCode}, {country}</span>
//       </p>
//       <p className="text-base-bold">
//         Total Paid: <span className="text-base-medium">${orderDetails.totalAmount}</span>
//       </p>
//       <p className="text-base-bold">
//         Shipping rate ID: <span className="text-base-medium">{orderDetails.shippingRate}</span>
//       </p>
//       <DataTable columns={columns} data={orderDetails.products} searchKey="product"/>
//     </div>
//   )
// }

// export default OrderDetails
"use client";

import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColums";
import { useEffect, useState } from "react";
import Loader from "@/components/custom ui/Loader";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const OrderDetails = ({ params }: { params: { orderId: string } }) => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingPaymentStatus, setIsUpdatingPaymentStatus] = useState(false);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`);
        if (!res.ok) {
          throw new Error(`Error fetching order details: ${res.statusText}`);
        }
        const data = await res.json();
        setOrderDetails(data.orderDetails);
        setCustomer(data.customer);
      } catch (err) {
        console.error("[order_details_GET]", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.orderId) {
      getOrderDetails();
    }
  }, [params.orderId]);

  const handlePaymentStatusToggle = async () => {
    if (!orderDetails || orderDetails.paymentStatus === 'paid') return;

    setIsUpdatingPaymentStatus(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: 'paid' }),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setOrderDetails((prev: any) => ({ ...prev, paymentStatus: updatedData.paymentStatus }));
        // Consider using toast instead of alert
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update payment status');
      }
    } catch (err: any) {
      console.error("[payment_status_PATCH]", err);
    } finally {
      setIsUpdatingPaymentStatus(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!orderDetails || !customer) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg font-serif text-[#2a2a2a]">Order details not found.</p>
      </div>
    );
  }

  const { street, city, state, postalCode, country, phone } = orderDetails.shippingAddress;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-light text-[#2a2a2a] tracking-wider">
          ORDER DETAILS
        </h1>
        <Separator className="bg-[#b89d7a] h-px mt-2 w-32" />
      </div>

      {/* Order Information */}
      <div className="bg-white p-8 shadow-sm border border-gray-100 mb-10">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">
                Order ID
              </h3>
              <p className="text-[#2a2a2a]">{orderDetails._id}</p>
            </div>

            <div>
              <h3 className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">
                Customer
              </h3>
              <p className="text-[#2a2a2a]">{customer.name}</p>
              <p className="text-[#2a2a2a]">{customer.email}</p>
            </div>

            <div>
              <h3 className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">
                Shipping Address
              </h3>
              <p className="text-[#2a2a2a]">
                {street}, {city}, {state}, {postalCode}, {country}
              </p>
              <p className="text-[#2a2a2a]">Phone: {phone}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">
                Payment Information
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#2a2a2a]">Method: {orderDetails.paymentMethod}</p>
                  <p className="text-[#2a2a2a]">
                    Status: <span className={orderDetails.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}>
                      {orderDetails.paymentStatus}
                    </span>
                  </p>
                </div>
                {orderDetails.paymentMethod === 'cod' && orderDetails.paymentStatus === 'unpaid' && (
                  <button
                    onClick={handlePaymentStatusToggle}
                    disabled={isUpdatingPaymentStatus}
                    className="bg-[#2a2a2a] text-white hover:bg-[#1a1a1a] rounded-none px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
                  >
                    {isUpdatingPaymentStatus ? 'Processing...' : 'Mark as Paid'}
                  </button>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">
                Order Status
              </h3>
              <p className="text-[#2a2a2a]">{orderDetails.orderStatus}</p>
            </div>

            <div>
              <h3 className="text-xs font-medium text-gray-600 tracking-widest uppercase mb-1">
                Total Amount
              </h3>
              <p className="text-xl font-serif text-[#2a2a2a]">
                ${orderDetails.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Products */}
      <div>
        <h2 className="text-xl font-serif font-light text-[#2a2a2a] tracking-wider mb-6">
          ORDERED PRODUCTS
        </h2>
        <DataTable 
          columns={columns} 
          data={orderDetails.products} 
          searchKey="product"
          // className="border border-gray-200 rounded-none"
        />
      </div>
    </div>
  );
};

export default OrderDetails;