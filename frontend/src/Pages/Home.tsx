import HomeLayout from "@/AppComponents/Sidebar/HomeLayout";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, type allUsers } from "@/apiEndpoints/Users";
import type { error } from "@/apiEndpoints/Auth";
import { useSelector } from "react-redux";
import AdminDashboard from "@/AppComponents/AdminDashboard/AdminDashboard";
import UserDashboard from "@/AppComponents/UserDashboard/UserDashboard";

const Home = () => {

  const userRole = useSelector((state:any)=> state.user.role);

  if(userRole == "ADMIN_ROLE"){
    return <AdminDashboard/>
  }

  return (
    <>
      <UserDashboard/>
    </>
  );
};

export default Home;
