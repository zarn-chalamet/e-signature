import type { error } from "@/apiEndpoints/Auth";
import { getAllUsers, type allUsers } from "@/apiEndpoints/Users";
import { useQuery } from "@tanstack/react-query";
import React from "react";

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
    { title: "Users", path: "/dashboard/allUsers", userCount: userData?.allUsers?.length },
    { title: "Templates", path: "/dashboard/templates", templateCount: 0 },
  ];

  console.log(userData);
  return (
    <>
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 items-center justify-items-center">
        {cards.map((item)=>(
            <div>
                
            </div>
        ))}
      </div>
    </>
  );
};

export default AdminDashboard;
