<<<<<<< HEAD
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
=======
import react from 'react';
import Header from '../component/Header.jsx'
import Sidebar from '../component/Sidebar.jsx'
import Footer from '../component/Footer.jsx'



function Layout({ children }) {

    return (
        
            <div className="main-wrapper">
                <Header />
                <Sidebar />                        
                {children}
                <Footer />
            </div>
       
    )
}

export default Layout
>>>>>>> 03d81f56022da2565aeb1358774daebf7136ba83
