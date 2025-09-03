import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface Template {
  id: string;
  uploaderId: string;
  title: string;
  uploadedAt: string;
  fileUrl: string;
  frequency: number | null;
  public: boolean;
}

interface TemplateChartsProps {
  templates: Template[];
}

const TemplateCharts: React.FC<TemplateChartsProps> = ({ templates }) => {
  // Check if templates is undefined or null
  if (!templates || templates.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Template Analytics</h2>
        <div className="flex justify-center items-center h-40 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No template data available</p>
        </div>
      </div>
    );
  }

  // Prepare data for public status chart
  const publicStatusData = [
    { name: "Public", value: templates.filter((t) => t.public).length },
    { name: "Private", value: templates.filter((t) => !t.public).length },
  ];

  // Prepare data for upload timeline (group by date)
  const uploadData = templates.reduce((acc, template) => {
    const date = new Date(template.uploadedAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const timelineData = Object.entries(uploadData).map(([date, count]) => ({
    date,
    count,
  }));

  // Colors for the charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Timeline Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Template Upload Timeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Uploads"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Public Status Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Template Visibility
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={publicStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {publicStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default TemplateCharts;
