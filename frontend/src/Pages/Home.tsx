import HomeLayout from "@/AppComponents/Sidebar/HomeLayout";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, type allUsers } from "@/apiEndpoints/Users";
import type { error } from "@/apiEndpoints/Auth";
import { useSelector } from "react-redux";
import AdminDashboard from "@/AppComponents/AdminDashboard/AdminDashboard";
import UserDashboard from "@/AppComponents/UserDashboard/UserDashboard";
import {
  getPublicTemplates,
  type publicTemplates,
} from "@/apiEndpoints/Templates";

const Home = () => {
  const userRole = useSelector((state: any) => state.user.role);

  const {
    data: userData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery<allUsers>({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  const {
    data: publicTemplatesData,
    isLoading: templatesLoading,
    error: templatesError,
  } = useQuery<publicTemplates>({
    queryKey: ["publicTemplates"],
    queryFn: getPublicTemplates,
  });

  if (userRole == "ADMIN_ROLE") {
    return (
      <AdminDashboard
        allUsers={userData?.allUsers}
        publicTemplates={publicTemplatesData?.publicTemplates}
        userLoading={usersLoading}
        templateLoading={templatesLoading}
      />
    );
  }

  return (
    <>
      <UserDashboard />
    </>
  );
};

export default Home;
