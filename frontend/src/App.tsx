import "./App.css";
import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Home from "./Pages/Home";
import { Suspense } from "react";
import Auth from "./Auth/Auth";
import About from "./Pages/About";
import ProtectRoute from "./Layout/ProtectRoute";
import HomeLayout from "./AppComponents/Home/HomeLayout";
import Profile from "./Pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // <Outlet /> renders here
    children: [
      {
        element: <HomeLayout/>,
        children: [
          { index: true, element: <Home /> },
          { path: "profile", element: <Profile /> },
          // add more pages here...
        ],
      },
      {
        path: "auth",
        element: <Auth />,
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
