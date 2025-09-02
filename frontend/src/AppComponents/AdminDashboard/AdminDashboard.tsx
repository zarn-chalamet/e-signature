
import React, { useEffect, useState } from "react";
import CreateNewUser from "./CreateNewUser";
import { Plus } from "lucide-react";
import UserCharts from "./charts/UserCharts";
import { UserTable } from "./UserTable";

type userMode = "chart" | "table";

interface AdminDashboardProps{
    allUsers: any;
    publicTemplates: any;
    userLoading: boolean;
    templateLoading: boolean;
}

const AdminDashboard = ({allUsers, publicTemplates, userLoading, templateLoading}: AdminDashboardProps) => {
//   const {
//     data: userData,
//     isLoading: usersLoading,
//     error: usersError,
//   } = useQuery<allUsers>({
//     queryKey: ["allUsers"],
//     queryFn: getAllUsers,
//   });

//   const {
//     data: publicTemplatesData,
//     isLoading: templatesLoading,
//     error: templatesError,
//   } = useQuery<publicTemplates>({
//     queryKey: ["publicTemplates"],
//     queryFn: getPublicTemplates,
//   });

  const [mode, setMode] = useState<userMode>("chart");

  const toggleMode = () => {
    setMode((prev) => (prev === "chart" ? "table" : "chart"));
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

  return (
    <div className="py-3">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, index) => (
          <div
            key={index}
            className={`w-full h-28 ${item.bgColor} ${item.hoverColor} rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer`}
            onClick={toggleMode}
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

      {mode == "chart" ? (
        <UserCharts users={allUsers} />
      ) : (
        <UserTable users={allUsers} />
      )}
    </div>
  );
};

export default AdminDashboard;

//   const [users, setUsers] = useState<userInfo[]>();
//   useEffect(()=>{
//     setUsers(userData?.allUsers);
//   }, []);
