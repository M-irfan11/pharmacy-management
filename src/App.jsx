
import Header from './component/Header.jsx'
import Sidebar from './component/Sidebar.jsx'
import Footer from './component/Footer.jsx'
import Content from './page/Content.jsx'
import Dashboard from './page/Dashboard.jsx'
import Doctors from './page/Doctors.jsx'
import Patients from './page/Patients.jsx'
import Appointment from './page/Appointment.jsx'
import Categories from "./page/Categories/Index.jsx"; 
import CategoryCreate from "./page/Categories/Create.jsx"; 
import CategoryEdit from "./page/Categories/Edit.jsx"; 

import { BrowserRouter, Routes, Route } from 'react-router'

function App() {

  return (
    <BrowserRouter>
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <Routes>

          <Route path="categories">
                      <Route index element={<Categories />} />
                      <Route path="create" element={<CategoryCreate />} />
                      <Route path="edit/:id" element={<CategoryEdit />} />
          </Route>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/content" element={<Content />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointment" element={<Appointment />} />
        </Routes>


        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
