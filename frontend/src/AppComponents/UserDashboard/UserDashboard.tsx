import {
  getReceivedRequests,
  type allReceivedRequests,
} from "@/apiEndpoints/Signature";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RequestsChart from "./RequestsChart";
interface UserDashboardProps {
  publicTemplates: any;
  templateLoading: boolean;
  allRequests: any;
  requestLoading: boolean;
  sentRequests: any;
  sentRequestLoading: boolean;
}

const UserDashboard = ({
  publicTemplates,
  templateLoading,
  allRequests,
  requestLoading,
  sentRequests,
  sentRequestLoading,
}: UserDashboardProps) => {
  const cards = [
    {
      title: "Public Templates",
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
      path: "/request",
      count: sentRequests?.length || 0,
      bgColor: "bg-green-200",
      textColor: "text-green-800",
      hoverColor: "hover:bg-green-250",
    },
  ];

  return (
    <>
      <motion.h1
        className="text-2xl font-semibold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        User Dashboard
      </motion.h1>
      <div className="grid grid-cols-4 items-center justify-items-center gap-6">
        {cards.map((item, index) => (
          <Link
            to={item.path}
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
          </Link>
        ))}
      </div>

      <div className="py-6">
            <h1 className="text-lg mb-6 font-semibold">Received Requests Analytics</h1>
          <RequestsChart requests={allRequests}/>
      </div>
    </>
  );
};

export default UserDashboard;
