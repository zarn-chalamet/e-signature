import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Adjust import path as needed
// Adjust import path as needed
import type { allReceivedRequests, receivedRequest } from '@/apiEndpoints/Signature';

interface RequestsChartProps {
  requests: receivedRequest[] | undefined | null;
}

const RequestsChart: React.FC<RequestsChartProps> = ({ requests }) => {
  // Check if requests is undefined or null
  if (!requests || requests.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Request Analytics</h2>
        <div className="flex justify-center items-center h-40 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No request data available</p>
        </div>
      </div>
    );
  }

  // Prepare data for status distribution chart
  const statusCount = requests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCount).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare data for request timeline (group by date)
  const requestData = requests.reduce((acc, request) => {
    const date = new Date(request.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const timelineData = Object.entries(requestData).map(([date, count]) => ({
    date,
    count,
  }));

  // Colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Status Distribution Pie Chart */}
      <div className="bg-card p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-center">Request Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Request Timeline Bar Chart */}
      <div className="bg-card p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-center">Request Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Requests" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RequestsChart;