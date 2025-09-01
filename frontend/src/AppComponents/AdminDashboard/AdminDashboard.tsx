import type { error, userInfo } from "@/apiEndpoints/Auth";
import { getAllUsers, type allUsers } from "@/apiEndpoints/Users";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import CreateNewUser from "./CreateNewUser";
import { Plus } from "lucide-react";

const AdminDashboard = () => {
  const {
    data: userData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery<allUsers>({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  const cards = [
    {
      title: "Users",
      path: "/dashboard/allUsers",
      count: userData?.allUsers?.length || 0,
      bgColor: "bg-green-200",
      textColor: "text-green-800",
      hoverColor: "hover:bg-green-300",
    },
    {
      title: "Templates",
      path: "/dashboard/templates",
      count: 0,
      bgColor: "bg-yellow-200",
      textColor: "text-yellow-800",
      hoverColor: "hover:bg-yellow-300",
    },
  ];

  if (usersLoading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex justify-center items-center h-40">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">Error loading user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
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
              <span>Create new User</span> <Plus/> 
            </div>
          }
        />
        <CreateNewUser
          trigger={
            <div className="w-full h-28 bg-gray-200 rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer flex flex-col items-center gap-2 text-center justify-center">
              <span>Create new Template</span> <Plus/> 
            </div>
          }
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

//   const [users, setUsers] = useState<userInfo[]>();
//   useEffect(()=>{
//     setUsers(userData?.allUsers);
//   }, []);
