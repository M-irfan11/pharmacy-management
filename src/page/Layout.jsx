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
