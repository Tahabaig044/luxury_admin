
"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useTheme } from "next-themes"



const SalesChart = ({ data }: { data: any[] }) => {
  const { theme } = useTheme()
  const textColor = theme === 'dark' ? '#fff' : '#2a2a2a'
  const gridColor = theme === 'dark' ? '#444' : '#eee'

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: textColor }}
          tickMargin={10}
        />
        <YAxis 
          tick={{ fill: textColor }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
            borderColor: '#b89d7a',
            borderRadius: '8px',
          }}
          formatter={(value) => [`$${value}`, 'Sales']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="#b89d7a" 
          strokeWidth={2}
          dot={{ fill: '#b89d7a', r: 4 }}
          activeDot={{ r: 6, stroke: '#b89d7a', strokeWidth: 2 }}
          name="Monthly Sales"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SalesChart