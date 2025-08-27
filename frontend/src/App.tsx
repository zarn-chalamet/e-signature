import "./App.css";
import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Home from "./Pages/Home";
import { Suspense } from "react";
import Auth from "./Auth/Auth";
import About from "./Pages/About";
import ProtectRoute from "./Layout/ProtectRoute";
import HomeLayout from "./AppComponents/Sidebar/HomeLayout";
import Profile from "./Pages/Profile";
import Request from "./Pages/Request";
import Template from "./Pages/Template";
import Report from "./Pages/Report";
import History from "./Pages/History";
import Testing from "./Pages/testing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // <Outlet /> renders here
    children: [
      {
        element: <HomeLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "profile", element: <Profile /> },
          { path: "request", element: <Request /> },
          { path: "template", element: <Template /> },
          { path: "report", element: <Report /> },
          { path: "history", element: <History /> },
        ],
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "test",
        element: <Testing />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
