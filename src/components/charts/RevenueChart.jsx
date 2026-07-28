import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No revenue data available
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.event?.title || `Event ${item.eventId}`,
    orders: item.orderCount || 0,
    revenue: (item.revenue || 0).toFixed(2),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Orders" />
        <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;