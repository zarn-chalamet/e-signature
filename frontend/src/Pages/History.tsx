import React, { useState } from "react";
import { motion } from "framer-motion";
import { ApprovedTable } from "@/AppComponents/History/ApprovedTable";
import { useQuery } from "@tanstack/react-query";
import {
  getReceivedRequests,
  getSentRequests,
  type allReceivedRequests,
  type sentRequests,
} from "@/apiEndpoints/Signature";
import { Button } from "@/components/ui/button";

const History = () => {
  const { data: requestsData, isLoading: requestLoading } =
    useQuery<allReceivedRequests>({
      queryKey: ["allRequests"],
      queryFn: getReceivedRequests,
    });

  const { data: sentRequestsData, isLoading: sentRequestLoading } =
    useQuery<sentRequests>({
      queryKey: ["sentRequests"],
      queryFn: getSentRequests,
    });

  const [toggle, setToggle] = useState<boolean>(false);
  const [sentToggle, setSentToggle] = useState<boolean>(false);

  const sentRequestsToggle = () => {
    setSentToggle(!sentToggle);
  };

  const toggleRequests = () => {
    setToggle(!toggle);
  };
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
      <div className="mb-8">
        <div className="flex flex-row justify-between items-center">
          <motion.h1
            className="text-xl font-semibold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Received Requests
          </motion.h1>
          <Button variant={"outline"} onClick={toggleRequests}>
            {toggle ? "All Requests" : "Approved Requests"}
          </Button>
        </div>
        <ApprovedTable
          requests={requestsData}
          toggleApprovedRequests={!toggle}
        />
      </div>
      <div className="mb-8">
        <div className="flex flex-row justify-between items-center">
          <motion.h1
            className="text-xl font-semibold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Sent Requests
          </motion.h1>
          <Button variant={"outline"} onClick={sentRequestsToggle}>
            {sentToggle ? "All Requests" : "Approved Requests"}
          </Button>
        </div>
        <ApprovedTable
          requests={sentRequestsData}
          toggleApprovedRequests={!sentToggle}
        />
      </div>
    </>
  );
};

export default History;
