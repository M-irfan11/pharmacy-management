import { useState } from "react";


// import Layout from "./page/Layout.jsx";
import Login from "./page/Login.jsx";
import Logout from "./Auth/Logout.jsx";
import Register from "./page/Register.jsx";
import Profile from "./page/Profile.jsx";
import ForgotPassword from "./page/Forgot-password.jsx";
import ResetPassword from "./page/ResetPssword.jsx";

import Dashboard from "./page/Dashboard.jsx";
import Content from "./page/Content.jsx";


import Categories from "./page/categories/index.jsx";
import CategoryCreate from "./page/categories/create.jsx";
import Protected from './Auth/Protected.jsx';


import Users from "./page/users/index.jsx";
import UserCreate from "./page/users/create.jsx";
import UserEdit from "./page/users/Edit.jsx";

import Employees from "./page/employees/index.jsx";
import EmployeeCreate from "./page/employees/create.jsx";

import Medicines from "./page/medicines/index.jsx";
import MedicinesCreate from "./page/medicines/create.jsx";

import Purchase from './page/Purchase/index.jsx';
import PurchaseCreate from './page/Purchase/create.jsx';

import Sale from './page/Sale/index.jsx';
import SaleCreate from './page/Sale/create.jsx';
import PurchaseReturns from './page/Purchase_return/index.jsx';
import PurchaseReturnCreate from './page/Purchase_return/create.jsx';
import SaleReturns from './page/Sale_return/index.jsx';
import SaleReturnCreate from './page/Sale_return/create.jsx';
import Accounts from "./page/Accounts/index.jsx";




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
          <Route path="/profile" element={<Profile />} />

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
              <Route path="/purchase-returns" element={<PurchaseReturns />} />
              <Route path="/purchase-returns/create" element={<PurchaseReturnCreate />} />
              <Route path="/purchase-returns/edit/:id" element={<PurchaseReturnCreate />} />


          <Route path="/sales" element={<Sale />} />
            <Route path="/sales/create" element={<SaleCreate />} />
            <Route path="/sales/edit/:id" element={<SaleCreate />} />
            <Route path="/sale-returns" element={<SaleReturns />} />
            <Route path="/sale-returns/create" element={<SaleReturnCreate />} />
            <Route path="/sale-returns/edit/:id" element={<SaleReturnCreate />} />

            <Route path="/accounts" element={<Navigate to="/accounts/heads" replace />} />
            <Route path="/accounts/:section" element={<Accounts />} />
          



          <Route path="supplier">
            <Route index element={<Supplier />} />
            <Route path="create" element={<SupplierCreate />} />
            <Route path="edit/:id" element={<SupplierCreate />} />
          </Route>


          <Route path="users">
            <Route index element={<Users />} />
            <Route path="create" element={<UserCreate />} />
            <Route path="edit/:id" element={<UserEdit />} />
          </Route>

          <Route path="employees">
            <Route index element={<Employees />} />
            <Route path="create" element={<EmployeeCreate />} />
            <Route path="edit/:id" element={<EmployeeCreate />} />
          </Route>

          <Route path="*" element={<div style={{ padding: 20 }}>Page not found</div>} />
          </Route>

      </Routes>


    </BrowserRouter>
  );
}

export default App;