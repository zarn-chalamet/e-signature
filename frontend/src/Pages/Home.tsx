import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, type allUsers } from "@/apiEndpoints/Users";
import type { error } from "@/apiEndpoints/Auth";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboard from "@/AppComponents/AdminDashboard/AdminDashboard";
import UserDashboard from "@/AppComponents/UserDashboard/UserDashboard";
import {
  getPublicTemplates,
  type publicTemplates,
} from "@/apiEndpoints/Templates";
import { setAllUsers } from "@/Store/slices/AllUsersSlice";
import { setPublicTemplates } from "@/Store/slices/PublicTemplatesSlice";
import {
  getReceivedRequests,
  getSentRequests,
  type allReceivedRequests,
  type sentRequests,
} from "@/apiEndpoints/Signature";

const Home = () => {
  const userRole = useSelector((state: any) => state.user.role);
  const dispatch = useDispatch();

  const {
    data: userData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery<allUsers>({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  dispatch(setAllUsers(userData?.allUsers ?? []));

  const {
    data: publicTemplatesData,
    isLoading: templatesLoading,
    error: templatesError,
  } = useQuery<publicTemplates>({
    queryKey: ["publicTemplates"],
    queryFn: getPublicTemplates,
  });

  dispatch(setPublicTemplates(publicTemplatesData?.publicTemplates ?? []));

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

  if (userRole == "ADMIN_ROLE") {
    return (
      <AdminDashboard
        allUsers={userData?.allUsers}
        publicTemplates={publicTemplatesData?.publicTemplates}
        userLoading={usersLoading}
        templateLoading={templatesLoading}
        allRequests={requestsData?.allRequests}
        requestLoading={requestLoading}
        sentRequests={sentRequestsData?.allRequests}
        sentRequestLoading={sentRequestLoading}
      />
    );
  }

  return (
    <>
      <UserDashboard
        publicTemplates={publicTemplatesData?.publicTemplates}
        templateLoading={templatesLoading}
        allRequests={requestsData?.allRequests}
        requestLoading={requestLoading}
        sentRequests={sentRequestsData?.allRequests}
        sentRequestLoading={sentRequestLoading}
      />
    </>
  );
};

export default Home;
