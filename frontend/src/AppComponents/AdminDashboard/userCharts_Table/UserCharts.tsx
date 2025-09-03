import type { allUsersInfo } from '@/apiEndpoints/Users';
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface User {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUrl: string | null;
  createdAt: string;
  recentTemplates: any | null;
  restricted: boolean;
}

interface UserChartsProps {
  users: allUsersInfo[] | undefined | null;

}

const UserCharts: React.FC<UserChartsProps> = ({ users }) => {
  // Check if users is undefined or null
  if (!users || users.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">User Analytics</h2>
        <div className="flex justify-center items-center h-40 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No user data available</p>
        </div>
      </div>
    );
  }

  // Prepare data for role distribution chart
  const roleCount = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roleData = Object.entries(roleCount).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare data for registration timeline (group by date)
  const registrationData = users.reduce((acc, user) => {
    const date = new Date(user.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const timelineData = Object.entries(registrationData).map(([date, count]) => ({
    date,
    count,
  }));

  // Colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-center">User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Registration Timeline Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-center">User Registration Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Registrations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default UserCharts;