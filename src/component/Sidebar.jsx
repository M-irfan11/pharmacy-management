import { useState } from "react"
import { NavLink, useLocation } from "react-router"

function Sidebar() {
  const location = useLocation()
  const isAccountPage = location.pathname.startsWith("/accounts/")
  const [accountMenuState, setAccountMenuState] = useState(() => ({
    pathname: location.pathname,
    open: isAccountPage,
  }))
  const isAccountMenuOpen = accountMenuState.pathname === location.pathname
    ? accountMenuState.open
    : isAccountPage
  const isOtherRouteActive = isAccountMenuOpen && !isAccountPage
  const getClass = ({ isActive }) =>
    isActive && !isOtherRouteActive
        ? "!bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white font-semibold rounded-r-[30px] mr-3 border-l-[5px] border-[#ed02fe] shadow-[0_6px_16px_rgba(102,16,242,0.35)] [&_i]:!text-white [&_span]:!text-white"
        : "rounded-r-[30px] mr-3 transition-all duration-300 hover:!bg-gradient-to-br hover:from-[#0d6efd]/10 hover:to-[#6610f2]/10 hover:!text-[#6610f2] hover:[&_i]:!text-[#6610f2]"
  const accountMenuClass = isAccountPage || isAccountMenuOpen
    ? "!bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white font-semibold rounded-r-[30px] mr-3 border-l-[5px] border-[#ed02fe] shadow-[0_6px_16px_rgba(102,16,242,0.35)] [&_i]:!text-white [&_span]:!text-white"
    : "rounded-r-[30px] mr-3 transition-all duration-300 hover:!bg-gradient-to-br hover:from-[#0d6efd]/10 hover:to-[#6610f2]/10 hover:!text-[#6610f2] hover:[&_i]:!text-[#6610f2]"
    return (
        <div className="sidebar" id="sidebar">
            <div className="sidebar-inner slimscroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    <ul>
                        <li className="menu-title !py-1.5"></li>
                        <li >
                            <NavLink to="/dashboard" className={getClass}>
                                <i className="fa fa-tachometer"></i> <span>Dashboard</span> 
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/categories" className={getClass}>
                                <i className="fa fa-th-large"></i> <span>Categories</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/supplier" className={getClass}>
                                <i className="fa fa-truck"></i> <span>Supplier</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/purchases" className={getClass}>
                                <i className="fa fa-shopping-cart"></i> <span>Purchase</span>
                            </NavLink>
                        </li>

                         <li>
                                    <NavLink to="/purchase-returns" className={getClass}>
                                        <i className="fa fa-undo"></i> <span>Purchase Returns</span>
                                    </NavLink>
                        </li>
                        
                        <li>
                            <NavLink to="/medicines" className={getClass}>
                                <i className="fa fa-medkit"></i> <span>Medicines</span>
                            </NavLink>
                        </li>
                        
                        <li>
                            <NavLink to="/sales" className={getClass}>
                                <i className="fa fa-credit-card"></i> <span>Sales</span>
                            </NavLink>
                        </li>

                         <li>
                            <NavLink to="/sale-returns" className={getClass}>
                              <i className="fa fa-reply"></i> <span>Sale Returns</span>
                            </NavLink>
                         </li>

                         <li className="submenu">
                             <a
                                 href="#"
                                 className={`${accountMenuClass} ${isAccountMenuOpen ? "subdrop" : ""}`}
                                 aria-expanded={isAccountMenuOpen}
                                 onClick={(event) => {
                                     event.preventDefault()
                                     setAccountMenuState({
                                         pathname: location.pathname,
                                         open: !isAccountMenuOpen,
                                     })
                                 }}
                             >
                                 <i className="fa fa-list-alt"></i> <span>Accounts</span> <span className="menu-arrow"></span>
                             </a>
                             <ul style={{ display: isAccountMenuOpen ? "block" : "none" }}>
                                <li><NavLink to="/accounts/heads" className={getClass}><i className="fa fa-list-alt"></i> <span>Account Heads</span></NavLink></li>
                                <li><NavLink to="/accounts/journal" className={getClass}><i className="fa fa-book"></i> <span>Journal Voucher</span></NavLink></li>
                                <li><NavLink to="/accounts/receive" className={getClass}><i className="fa fa-sign-in"></i> <span>Receive Voucher</span></NavLink></li>
                                <li><NavLink to="/accounts/payment" className={getClass}><i className="fa fa-sign-out"></i> <span>Payment Voucher</span></NavLink></li>
                                <li><NavLink to="/accounts/ledger" className={getClass}><i className="fa fa-book"></i> <span>Ledger</span></NavLink></li>
                                <li><NavLink to="/accounts/profit-loss" className={getClass}><i className="fa fa-line-chart"></i> <span>Profit &amp; Loss</span></NavLink></li>
                            </ul>
                        </li>
                       
                       <li>
                            <NavLink to="/users" className={getClass}>
                                <i className="fa fa-users"></i> <span>Users</span>
                            </NavLink>
                        </li>




                        {/* <li className="submenu">
                            <a
                                href="#"
                                aria-expanded={returnsOpen || isReturnPage}
                                onClick={(event) => {
                                    event.preventDefault()
                                    setReturnsOpen((open) => !open)
                                }}
                            >
                                <i className="fa fa-undo"></i> <span>Returns</span> <span className="menu-arrow"></span>
                            </a>
                            <ul style={{ display: returnsOpen || isReturnPage ? "block" : "none" }}>
                                <li>
                                    <NavLink to="/sale-returns" className={getClass}>
                                        <i className="fa fa-reply"></i> <span>Sale Returns</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/purchase-returns" className={getClass}>
                                        <i className="fa fa-undo"></i> <span>Purchase Returns</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </li> */}

                        

                        
                       
                        <li className="submenu">
                            <a href="#"><i className="fa fa-user"></i> <span> Employees </span> </a>
                            <ul style={{display: 'none' }}>
                                <li><a href="employees.html">Employees List</a></li>
                                <li><a href="leaves.html">Leaves</a></li>
                                <li><a href="holidays.html">Holidays</a></li>
                                <li><a href="attendance.html">Attendance</a></li>
                            </ul>
                        </li>
                        {/* <li className="menu-title">Accounts</li> */}
                       
                       
                       
                        {/* <li><NavLink to="/accounts/journal" className={getClass}><i className="fa fa-book"></i> <span>Journal Voucher</span></NavLink></li>
                        <li><NavLink to="/accounts/receive" className={getClass}><i className="fa fa-sign-in"></i> <span>Receive Voucher</span></NavLink></li>
                        <li><NavLink to="/accounts/payment" className={getClass}><i className="fa fa-sign-out"></i> <span>Payment Voucher</span></NavLink></li>
                        <li><NavLink to="/accounts/ledger" className={getClass}><i className="fa fa-book"></i> <span>Ledger</span></NavLink></li>
                        <li><NavLink to="/accounts/profit-loss" className={getClass}><i className="fa fa-line-chart"></i> <span>Profit &amp; Loss</span></NavLink></li> */}
                        
                        
                        {/* <li className="submenu">
                            <a
                                href="#"
                                aria-expanded={AccountsOpen || isAccountPage}
                                onClick={(event) => {
                                    event.preventDefault()
                                    setReturnsOpen((open) => !open)
                                }}
                            >
                                <i className="fa fa-list-alt"></i> <span>Accounts</span> <span className="menu-arrow"></span>
                            </a>
                            <ul style={{ display: AccountsOpen || isAccountPage ? "block" : "none" }}>
                                <li>
                                    <NavLink to="/sale-returns" className={getClass}>
                                        <i className="fa fa-reply"></i> <span>Sale Returns</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/purchase-returns" className={getClass}>
                                        <i className="fa fa-undo"></i> <span>Purchase Returns</span>
                                    </NavLink>
                                </li>

                                <li><NavLink to="/accounts/journal" className={getClass}><i className="fa fa-book"></i> <span>Journal Voucher</span></NavLink></li>
                                <li><NavLink to="/accounts/receive" className={getClass}><i className="fa fa-sign-in"></i> <span>Receive Voucher</span></NavLink></li>
                                <li><NavLink to="/accounts/payment" className={getClass}><i className="fa fa-sign-out"></i> <span>Payment Voucher</span></NavLink></li>
                                <li><NavLink to="/accounts/ledger" className={getClass}><i className="fa fa-book"></i> <span>Ledger</span></NavLink></li>
                                <li><NavLink to="/accounts/profit-loss" className={getClass}><i className="fa fa-line-chart"></i> <span>Profit &amp; Loss</span></NavLink></li>
                                
                            </ul>
                        </li> */}
                        
                        
                        
                        
                        {/* <li className="submenu">
                            <a href="#"><i className="fa fa-book"></i> <span> Payroll </span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="salary.html"> Employee Salary </a></li>
                                <li><a href="salary-view.html"> Payslip </a></li>
                            </ul>
                        </li> */}
                      
                     
                    
                       
                        
                        
                       
                        
                       
                       
                        
                      
                      
                       
                    </ul>
                </div>
            </div>
        </div>

    )
}
export default Sidebar
