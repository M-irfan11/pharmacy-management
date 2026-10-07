import { Link } from "react-router"

function Sidebar() {
    return (
        <div className="sidebar" id="sidebar">
            <div className="sidebar-inner slimscroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    <ul>
                        <li className="menu-title">Main</li>
                        <li className="active">
                            <Link to="/Dashboard"><i className="fa fa-dashboard"></i> <span>Dashboard</span></Link>
                        </li>
                        <li>
                            <Link to="/Doctors"><i className="fa fa-user-md"></i> <span>Doctors</span></Link>
                        </li>
                        <li>
                            <Link to="/Patients"><i className="fa fa-wheelchair"></i> <span>Patients</span></Link>
                        </li>
                        <li>
                            <Link to="/Appointment"><i className="fa fa-calendar"></i> <span>Appointments</span></Link>
                        </li>
                        <li>
                            <Link to="/Categories"><i className="fa fa-calendar-check-o"></i> <span>Categories</span></Link>
                        </li>
                        <li>
                            <Link to="/Supplier"><i className="fa fa-hospital-o"></i> <span>Supplier</span></Link>
                        </li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-user"></i> <span> Employees </span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="employees.html">Employees List</a></li>
                                <li><a href="leaves.html">Leaves</a></li>
                                <li><a href="holidays.html">Holidays</a></li>
                                <li><a href="attendance.html">Attendance</a></li>
                            </ul>
                        </li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-money"></i> <span> Accounts </span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="invoices.html">Invoices</a></li>
                                <li><a href="payments.html">Payments</a></li>
                                <li><a href="expenses.html">Expenses</a></li>
                                <li><a href="taxes.html">Taxes</a></li>
                                <li><a href="provident-fund.html">Provident Fund</a></li>
                            </ul>
                        </li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-book"></i> <span> Payroll </span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="salary.html"> Employee Salary </a></li>
                                <li><a href="salary-view.html"> Payslip </a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="chat.html"><i className="fa fa-comments"></i> <span>Chat</span> <span className="badge badge-pill bg-primary float-right">5</span></a>
                        </li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-video-camera camera"></i> <span> Calls</span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="voice-call.html">Voice Call</a></li>
                                <li><a href="video-call.html">Video Call</a></li>
                                <li><a href="incoming-call.html">Incoming Call</a></li>
                            </ul>
                        </li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-envelope"></i> <span> Email</span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="compose.html">Compose Mail</a></li>
                                <li><a href="inbox.html">Inbox</a></li>
                                <li><a href="mail-view.html">Mail View</a></li>
                            </ul>
                        </li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-commenting-o"></i> <span> Blog</span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="blog.html">Blog</a></li>
                                <li><a href="blog-details.html">Blog View</a></li>
                                <li><a href="add-blog.html">Add Blog</a></li>
                                <li><a href="edit-blog.html">Edit Blog</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="assets.html"><i className="fa fa-cube"></i> <span>Assets</span></a>
                        </li>
                        <li>
                            <a href="activities.html"><i className="fa fa-bell-o"></i> <span>Activities</span></a>
                        </li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-flag-o"></i> <span> Reports </span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="expense-reports.html"> Expense Report </a></li>
                                <li><a href="invoice-reports.html"> Invoice Report </a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="settings.html"><i className="fa fa-cog"></i> <span>Settings</span></a>
                        </li>
                        <li className="menu-title">UI Elements</li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-laptop"></i> <span> Components</span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="uikit.html">UI Kit</a></li>
                                <li><a href="typography.html">Typography</a></li>
                                <li><a href="tabs.html">Tabs</a></li>
                            </ul>
                        </li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-edit"></i> <span> Forms</span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="form-basic-inputs.html">Basic Inputs</a></li>
                                <li><a href="form-input-groups.html">Input Groups</a></li>
                                <li><a href="form-horizontal.html">Horizontal Form</a></li>
                                <li><a href="form-vertical.html">Vertical Form</a></li>
                            </ul>
                        </li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-table"></i> <span> Tables</span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="tables-basic.html">Basic Tables</a></li>
                                <li><a href="tables-datatables.html">Data Table</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="calendar.html"><i className="fa fa-calendar"></i> <span>Calendar</span></a>
                        </li>
                        <li className="menu-title">Extras</li>
                        <li className="submenu">
                            <a href="#"><i className="fa fa-columns"></i> <span>Pages</span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li><a href="login.html"> Login </a></li>
                                <li><a href="register.html"> Register </a></li>
                                <li><a href="forgot-password.html"> Forgot Password </a></li>
                                <li><a href="change-password2.html"> Change Password </a></li>
                                <li><a href="lock-screen.html"> Lock Screen </a></li>
                                <li><a href="profile.html"> Profile </a></li>
                                <li><a href="gallery.html"> Gallery </a></li>
                                <li><a href="error-404.html">404 Error </a></li>
                                <li><a href="error-500.html">500 Error </a></li>
                                <li><a href="blank-page.html"> Blank Page </a></li>
                            </ul>
                        </li>
                        <li className="submenu">
                            <a href="javascript:void(0);"><i className="fa fa-share-alt"></i> <span>Multi Level</span> <span className="menu-arrow"></span></a>
                            <ul style={{ display: 'none' }}>
                                <li className="submenu">
                                    <a href="javascript:void(0);"><span>Level 1</span> <span className="menu-arrow"></span></a>
                                    <ul style={{ display: 'none' }}>
                                        <li><a href="javascript:void(0);"><span>Level 2</span></a></li>
                                        <li className="submenu">
                                            <a href="javascript:void(0);"> <span> Level 2</span> <span className="menu-arrow"></span></a>
                                            <ul style={{ display: 'none' }}>
                                                <li><a href="javascript:void(0);">Level 3</a></li>
                                                <li><a href="javascript:void(0);">Level 3</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="javascript:void(0);"><span>Level 2</span></a></li>
                                    </ul>
                                </li>
                                <li>
                                    <a href="javascript:void(0);"><span>Level 1</span></a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    )
}
export default Sidebar

