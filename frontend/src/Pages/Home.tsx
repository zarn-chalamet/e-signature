import HomeLayout from "@/AppComponents/Sidebar/HomeLayout";
import React from "react";

const Home = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-8 w-full">
        <div className="w-[200px] h-[200px] bg-gray-800"></div>
        <div className="w-[200px] h-[200px] bg-gray-800"></div>
        <div className="w-[200px] h-[200px] bg-gray-800"></div>
      </div>
    </>
  );
};

export default Home;
