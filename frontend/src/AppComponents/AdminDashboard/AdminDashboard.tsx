import React, { useEffect, useState } from "react";
import CreateNewUser from "./CreateNewUser";
import { Plus } from "lucide-react";
import UserCharts from "./userCharts_Table/UserCharts";
import { UserTable } from "./userCharts_Table/UserTable";
import TemplateCharts from "./templateCharts_Table/TemplateCharts";
import { TemplateTable } from "./templateCharts_Table/TemplateTable";
import { Button } from "@/components/ui/button";

type userMode = "chart" | "table";
type templateMode = "tempChart" | "tempTable";

interface AdminDashboardProps {
  allUsers: any;
  publicTemplates: any;
  userLoading: boolean;
  templateLoading: boolean;
}

const AdminDashboard = ({
  allUsers,
  publicTemplates,
  userLoading,
  templateLoading,
}: AdminDashboardProps) => {
  const [mode, setMode] = useState<userMode>("chart");
  const [tempmode, setTempMode] = useState<templateMode>("tempChart");

  const toggleMode = () => {
    setMode((prev) => (prev === "chart" ? "table" : "chart"));
  };
  const toggleTempMode = () => {
    setTempMode((prev) => (prev === "tempChart" ? "tempTable" : "tempChart"));
  };

  const cards = [
    {
      title: "Users",
      path: "/dashboard/allUsers",
      count: allUsers?.length || 0,
      bgColor: "bg-green-200",
      textColor: "text-green-800",
      hoverColor: "hover:bg-green-300",
    },
    {
      title: "Templates",
      path: "/dashboard/templates",
      count: publicTemplates?.length || 0,
      bgColor: "bg-yellow-200",
      textColor: "text-yellow-800",
      hoverColor: "hover:bg-yellow-300",
    },
  ];

  if (userLoading) {
    return (
      <div className="py-3">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex justify-center items-center h-40">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, index) => (
          <div
            key={index}
            className={`w-full h-28 ${item.bgColor} ${item.hoverColor} rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer`}
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className={`text-xl font-bold ${item.textColor}`}>
                {item.count}
              </p>
            </div>
            {/* <button className="bg-gray-200 w-full p-2 rounded-md">View Details</button> */}
          </div>
        ))}
        <CreateNewUser
          trigger={
            <div className="w-full h-28 bg-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer flex flex-col items-center gap-2 text-center justify-center">
              <span>Create new User</span> <Plus />
            </div>
          }
        />
        <CreateNewUser
          trigger={
            <div className="w-full h-28 bg-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer flex flex-col items-center gap-2 text-center justify-center">
              <span>Create new Template</span> <Plus />
            </div>
          }
        />
      </div>

      {/* Charts and Part */}
      <div className="py-6">
        <div className="flex flex-row items-center justify-between pb-6">
          <h2 className="text-xl font-bold">Users Analytics</h2>
          <Button variant={"outline"} onClick={toggleMode}>
            {mode == "chart" ? "View Table" : "View Charts"}{" "}
          </Button>
        </div>

        {mode == "chart" ? (
          <UserCharts users={allUsers} />
        ) : (
          <UserTable users={allUsers} />
        )}

        <div className="flex flex-row items-center justify-between py-6">
          <h2 className="text-xl font-bold mb-6 mt-6">Template Analytics</h2>
          <Button variant={"outline"} onClick={toggleTempMode}>
            {tempmode == "tempChart" ? "View Table" : "View Charts"}{" "}
          </Button>
        </div>
        {tempmode == "tempChart" ? (
          <TemplateCharts templates={publicTemplates} />
        ) : (
          <TemplateTable templates={publicTemplates} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


  //   if (userError) {
  //     return (
  //       <div className="py-3">
  //         <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
  //         <div className="flex justify-center items-center h-40">
  //           <p className="text-red-500">Error loading user data</p>
  //         </div>
  //       </div>
  //     );
  //   }