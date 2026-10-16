import { useState } from "react";


import Layout from "./page/Layout.jsx";
import Login from "./page/Login.jsx";
import Logout from "./auth/Logout.jsx";
import Register from "./page/Register.jsx";
import ForgotPassword from "./page/Forgot-password.jsx";
import ResetPassword from "./page/ResetPssword.jsx";

import Dashboard from "./page/Dashboard.jsx";
import Content from "./page/Content.jsx";
import Patients from "./page/Patients.jsx";
import Appointment from "./page/Appointment.jsx";

import Categories from "./page/categories/index.jsx";
import CategoryCreate from "./page/categories/create.jsx";
import CategoryEdit from "./page/categories/Edit.jsx";
import Protected from './Auth/Protected.jsx';


import Medicines from "./page/medicines/index.jsx";
import MedicinesCreate from "./page/medicines/create.jsx";

import Purchase from './page/Purchase/index.jsx';
import PurchaseCreate from './page/Purchase/create.jsx';




import Supplier from "./page/supplier/index.jsx";
import SupplierCreate from "./page/supplier/create.jsx";


import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

function App() {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    /* if you want, user will be logged in until they logout*/
    return localStorage.getItem("access_token") || false;
    /* if you want, user will be logged when they close the browser*/
    //return sessionStorage.getItem("access_token") || false;
  });
  return (
    <BrowserRouter>


      <Routes>
        {/* Header/Sidebar ছাড়া */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Header/Sidebar সহ */}
        <Route element={<Protected isSignedIn={isSignedIn} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/content" element={<Content />} />          
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointment" element={<Appointment />} />

          <Route path="categories">
            <Route index element={<Categories />} />
            <Route path="create" element={<CategoryCreate />} />
            <Route path="edit/:id" element={<CategoryCreate />} />
          </Route>

          <Route path="medicines">
            <Route index element={<Medicines />} />
            <Route path="create" element={<MedicinesCreate />} />
            <Route path="edit/:id" element={<MedicinesCreate />} />
          </Route>

         


           <Route path="/purchases" element={<Purchase />} />
              <Route path="/purchases/create" element={<PurchaseCreate />} />
              <Route path="/purchases/edit/:id" element={<PurchaseCreate />} />
          



          <Route path="supplier">
            <Route index element={<Supplier />} />
            <Route path="create" element={<SupplierCreate />} />
            <Route path="edit/:id" element={<SupplierCreate />} />
          </Route>

          <Route path="*" element={<div style={{ padding: 20 }}>Page not found</div>} />
          </Route>

      </Routes>


    </BrowserRouter>
  );
}

export default App;