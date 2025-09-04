import React, { useEffect, useState } from "react";
import CreateNewUser from "./CreateNewUser";
import { Plus } from "lucide-react";
import UserCharts from "./userCharts_Table/UserCharts";
import { UserTable } from "./userCharts_Table/UserTable";
import TemplateCharts from "./templateCharts_Table/TemplateCharts";
import { TemplateTable } from "./templateCharts_Table/TemplateTable";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type userMode = "chart" | "table";
type templateMode = "tempChart" | "tempTable";

interface AdminDashboardProps {
  allUsers: any;
  publicTemplates: any;
  userLoading: boolean;
  templateLoading: boolean;
  allRequests: any;
  requestLoading: boolean;
  sentRequests: any;
  sentRequestLoading: boolean;
}

const AdminDashboard = ({
  allUsers,
  publicTemplates,
  userLoading,
  templateLoading,
  allRequests,
  requestLoading,
  sentRequests,
  sentRequestLoading,
}: AdminDashboardProps) => {
  const [mode, setMode] = useState<userMode>("chart");
  const [tempmode, setTempMode] = useState<templateMode>("tempChart");
  const dispatch = useDispatch();

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
      bgColor: "bg-blue-200",
      textColor: "text-blue-800",
      hoverColor: "hover:bg-blue-300",
    },
    {
      title: "Templates",
      path: "/template",
      count: publicTemplates?.length || 0,
      bgColor: "bg-yellow-200",
      textColor: "text-yellow-800",
      hoverColor: "hover:bg-yellow-300",
    },
    {
      title: "Received Requests",
      path: "/received",
      count: allRequests?.length || 0,
      bgColor: "bg-purple-200",
      textColor: "text-purple-800",
      hoverColor: "hover:bg-purple-250",
    },
    {
      title: "Sent Requests",
      path: "/dashboard/allUsers",
      count: sentRequests?.length || 0,
      bgColor: "bg-green-200",
      textColor: "text-green-800",
      hoverColor: "hover:bg-green-250",
    },
  ];

  if (userLoading) {
    return (
      <div className="py-3">
        <h1 className="text-xl font-semibold mb-6">Admin Dashboard</h1>
        <div className="flex justify-center items-center h-40">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">
      <motion.h1
        className="text-2xl font-semibold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Admin Dashboard
      </motion.h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, index) => (
          <div
            key={index}
            className={`w-full h-28 ${item.bgColor} ${item.hoverColor} rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer`}
          >
            <div className="flex justify-between">
              <h2 className="text-lg text-gray-600 font-semibold">
                {item.title}
              </h2>
              <p className={`text-xl font-bold ${item.textColor}`}>
                {item.count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Part */}
      <div className="py-6">
        <div className="flex flex-row items-center justify-between pb-6">
          <h2 className="text-xl font-bold">Users Analytics</h2>
          <div className="flex gap-4 flex-row">
            <CreateNewUser
              trigger={
                <Button>
                  Create new User <Plus />
                </Button>
              }
            />
            <Button variant={"outline"} onClick={toggleMode}>
              {mode == "chart" ? "View Table" : "View Charts"}{" "}
            </Button>
          </div>
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

//   const {
//     data: userData,
//     isLoading: usersLoading,
//     error: usersError,
//   } = useQuery<allUsers>({
//     queryKey: ["allUsers"],
//     queryFn: getAllUsers,
//   });
//   dispatch(setAllUsers(userData?.allUsers ?? []));

{
  /* <CreateNewUser
          trigger={
            <div className="w-full h-28 bg-card rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer flex flex-col items-center gap-2 text-center justify-center">
              <span>Create new User</span> <Plus />
            </div>
          }
        /> */
}
{
  /* <CreateNewUser
          trigger={
            <div className="w-full h-28 bg-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer flex flex-col items-center gap-2 text-center justify-center">
              <span>Create new Template</span> <Plus />
            </div>
          }
        /> */
}
