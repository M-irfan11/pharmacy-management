import React from 'react';
import { Navigate, Outlet } from "react-router";
import Sidebar from "../component/Sidebar.jsx";
import Header from "../component/Header.jsx";
import Footer from "../component/Footer.jsx";

function Layout({ children }) {
  const token = sessionStorage.getItem("access_token");
  const userdata = sessionStorage.getItem("userdata");

  if (!token || !userdata) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <Header />
        {children ?? <Outlet />}
        <Footer />
      </div>
    </div>
  );
}

export default Layout;