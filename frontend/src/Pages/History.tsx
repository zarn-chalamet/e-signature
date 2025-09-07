import React, { useState } from "react";
import { motion } from "framer-motion";
import { ApprovedTable } from "@/AppComponents/History/ApprovedTable";
import { useQuery } from "@tanstack/react-query";
import {
  getReceivedRequests,
  type allReceivedRequests,
} from "@/apiEndpoints/Signature";
import { Button } from "@/components/ui/button";

const History = () => {
  const { data: requestsData, isLoading: requestLoading } =
    useQuery<allReceivedRequests>({
      queryKey: ["allRequests"],
      queryFn: getReceivedRequests,
    });

  const [toggle, setToggle] = useState<boolean>(false);

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
      <div>
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
            {toggle? "All Requests" : "Approved Requests"}
          </Button>
        </div>
        <ApprovedTable
          requests={requestsData}
          toggleApprovedRequests={!toggle}
        />
      </div>
    </>
  );
};

export default History;
