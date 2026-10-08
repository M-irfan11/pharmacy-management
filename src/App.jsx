

import Content from './page/Content.jsx'
import Dashboard from './page/Dashboard.jsx'
import Doctors from './page/Doctors.jsx'
import Patients from './page/Patients.jsx'
import Appointment from './page/Appointment.jsx'
import Categories from "./page/categories/Index.jsx";
import CategoryCreate from "./page/categories/Create.jsx";
import CategoryEdit from "./page/categories/Edit.jsx";
import Supplier from "./page/supplier/index.jsx";
import SupplierCreate from "./page/supplier/create.jsx";
import SupplierEdit from "./page/supplier/edit.jsx";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<Content />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/appointment" element={<Appointment />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
