import UserProfile from "@/AppComponents/Profile/UserProfile";
import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const userData = useSelector((state: any) => state.user);
  return (
    <>
      <UserProfile userData={userData} />
    </>
  );
};

export default Profile;
