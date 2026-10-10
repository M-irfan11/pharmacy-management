import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Layout from "./page/Layout.jsx";
import Login from "./page/Login.jsx";
import Register from "./page/Register.jsx";

import Dashboard from "./page/Dashboard.jsx";
import Content from "./page/Content.jsx";
import Doctors from "./page/Doctors.jsx";
import Patients from "./page/Patients.jsx";
import Appointment from "./page/Appointment.jsx";

import Categories from "./page/categories/Index.jsx";
import CategoryCreate from "./page/categories/Create.jsx";
import CategoryEdit from "./page/categories/Edit.jsx";

import Supplier from "./page/supplier/index.jsx";
import SupplierCreate from "./page/supplier/create.jsx";
import SupplierEdit from "./page/supplier/edit.jsx";

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        {/* Header/Sidebar ছাড়া */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Header/Sidebar সহ */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/content" element={<Content />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointment" element={<Appointment />} />

          <Route path="categories">
            <Route index element={<Categories />} />
            <Route path="create" element={<CategoryCreate />} />
            <Route path="edit/:id" element={<CategoryEdit />} />
          </Route>

          <Route path="supplier">
            <Route index element={<Supplier />} />
            <Route path="create" element={<SupplierCreate />} />
            <Route path="edit/:id" element={<SupplierEdit />} />
          </Route>

          <Route path="*" element={<div style={{ padding: 20 }}>Page not found</div>} />
        </Route>
      </Routes>
 
    </BrowserRouter>
  );
}

export default App;