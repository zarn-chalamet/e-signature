import React from "react";
import { motion } from "framer-motion";
import { ApprovedTable } from "@/AppComponents/History/ApprovedTable";
import { useQuery } from "@tanstack/react-query";
import {
  getReceivedRequests,
  type allReceivedRequests,
} from "@/apiEndpoints/Signature";

const History = () => {
  const { data: requestsData, isLoading: requestLoading } =
    useQuery<allReceivedRequests>({
      queryKey: ["allRequests"],
      queryFn: getReceivedRequests,
    });
  return (
    <>
      <motion.h1
        className="text-2xl font-semibold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        History
      </motion.h1>

      <ApprovedTable requests={requestsData} />
    </>
  );
};

export default History;
