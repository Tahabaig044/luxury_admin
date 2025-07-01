import SalesChart from "@/components/custom ui/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";

export default async function Home() {
  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();

  const graphData = await getSalesPerMonth();
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Dashboard Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-serif font-light text-[#2a2a2a] dark:text-white tracking-wider">
          DASHBOARD OVERVIEW
        </h1>
        <Separator className="bg-[#b89d7a] h-0.5 mt-4 w-24" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-widest">
              TOTAL REVENUE
            </CardTitle>
            <CircleDollarSign className="h-5 w-5 text-[#b89d7a]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-serif text-[#2a2a2a] dark:text-white">
              {formatCurrency(totalRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-widest">
              TOTAL ORDERS
            </CardTitle>
            <ShoppingBag className="h-5 w-5 text-[#b89d7a]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-serif text-[#2a2a2a] dark:text-white">
              {totalOrders}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-widest">
              TOTAL CUSTOMERS
            </CardTitle>
            <UserRound className="h-5 w-5 text-[#b89d7a]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-serif text-[#2a2a2a] dark:text-white">
              {totalCustomers}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-[#2a2a2a] dark:text-white tracking-wider">
            MONTHLY SALES PERFORMANCE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}
