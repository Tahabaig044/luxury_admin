import { DataTable } from '@/components/custom ui/DataTable'
import { columns } from '@/components/customers/CustomerColumns'
import { Separator } from '@/components/ui/separator'
import Customer from '@/lib/models/Customer'
import { connectToDB } from '@/lib/mongoDB'
import { Crown, Users, Star, ShoppingBag, UserPlus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'

const Customers = async () => {
  await connectToDB()

  const customers = await Customer.find().sort({ createdAt: "desc" })
  const totalCustomers = customers.length
  const vipCustomers = customers.filter(c => c.isVIP).length
  const newThisMonth = customers.filter(c => {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return new Date(c.createdAt) > monthAgo
  }).length

  return (
    <div className='bg-cream-50 min-h-screen'>
      {/* Header */}
      <div className='bg-gradient-to-r from-gray-900 to-gray-800 text-gold-500 px-10 py-8 relative'>
        <div className='flex items-center gap-4 mb-6'>
          <Crown className='w-8 h-8 text-gold-400' />
          <h1 className='font-playfair text-3xl font-bold'>
            Elite<span className='text-gold-400'>Client</span>
          </h1>
        </div>
        <h2 className='font-playfair text-4xl font-bold text-cream-100 mb-2'>Client Management</h2>
        <p className='text-cream-200 max-w-2xl opacity-85'>
          Manage your exclusive clientele with our premium tools and insights
        </p>
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent' />
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 py-8'>
        <StatCard 
          icon={<Users className='text-gold-300' />}
          title="Total Clients"
          value={totalCustomers.toString()}
        />
        <StatCard 
          icon={<Star className='text-gold-300' />}
          title="VIP Members"
          value={vipCustomers.toString()}
        />
        <StatCard 
          icon={<ShoppingBag className='text-gold-300' />}
          title="Avg. Purchase"
          value="$1,240"
        />
        <StatCard 
          icon={<UserPlus className='text-gold-300' />}
          title="New This Month"
          value={newThisMonth.toString()}
        />
      </div>

      {/* Decorative Separator */}
      <div className='h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-10 my-4' />

      {/* Main Content */}
      <div className='px-10 py-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <h3 className='font-playfair text-3xl font-semibold text-gray-800'>Client Directory</h3>
          <div className='relative w-full md:w-80'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gold-500' />
            <Input
              placeholder="Search clients..."
              className='pl-10 bg-cream-100 border-gold-200 focus-visible:ring-gold-300'
            />
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm'>
          <DataTable 
            columns={columns} 
            data={customers} 
            searchKey='name'
            // className='border-0'
            // rowClassName='hover:bg-cream-50'
          />
        </div>
      </div>

      {/* Footer */}
      <div className='px-10 py-4 bg-cream-100 border-t border-gold-200 flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='flex gap-2'>
          <PaginationButton><ChevronLeft className='h-4 w-4' /></PaginationButton>
          <PaginationButton active>1</PaginationButton>
          <PaginationButton>2</PaginationButton>
          <PaginationButton>3</PaginationButton>
          <PaginationButton><ChevronRight className='h-4 w-4' /></PaginationButton>
        </div>
        <p className='text-sm text-gray-600'>
          © {new Date().getFullYear()} EliteClient Management. Premium Luxury Solutions.
        </p>
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group'>
    <div className='text-gray-500 text-sm mb-2'>{title}</div>
    <div className='font-playfair text-3xl font-semibold text-gray-800'>{value}</div>
    <div className='absolute right-6 top-6 text-gray-200 group-hover:text-gold-200 transition-colors'>
      {icon}
    </div>
    <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-gold-300' />
  </div>
)

// Pagination Button Component
const PaginationButton = ({ children, active = false }: { children: React.ReactNode, active?: boolean }) => (
  <button className={`w-9 h-9 flex items-center justify-center rounded-md border ${active 
    ? 'bg-gold-500 border-gold-500 text-white' 
    : 'border-gray-300 text-gray-600 hover:border-gold-300 hover:text-gold-600'}`}>
    {children}
  </button>
)

export const dynamic = "force-dynamic"
export default Customers