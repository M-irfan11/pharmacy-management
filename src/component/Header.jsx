import { Link } from "react-router";
import { useState } from "react";

function Header() {
    const [openProfile, setOpenProfile] = useState(false);

    const toggleProfile = () => {
        setOpenProfile(!openProfile);
    };

    return (

        <div className="header bg-[linear-gradient(135deg,#0d6efd_0%,#6610f2_100%)]! shadow-[0_4px_16px_rgba(102,16,242,0.35)]">
            <div className="header-left bg-transparent!">
                <a href="index-2.html" className="logo  text-white!">
                    <img src={`${import.meta.env.BASE_URL}assets/img/logo.png`} width="35" height="35" alt="" /> <span>Easmin Pharma</span>
                </a>
            </div>
            {/* <a id="toggle_btn" href="javascript:void(0);" className="text-white! [&_i]:text-white!"><i className="fa fa-bars"></i></a>
            <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar"><i className="fa fa-bars"></i></a> */}
            <ul className="nav user-menu float-right">
                <li className="nav-item dropdown d-none d-sm-block">
                    <a href="#" className="dropdown-toggle nav-link" data-toggle="dropdown"><i className="fa fa-bell-o"></i> <span className="badge badge-pill bg-danger float-right">3</span></a>
                    <div className="dropdown-menu notifications">
                        <div className="topnav-dropdown-header">
                            <span>Notifications</span>
                        </div>
                        <div className="drop-scroll">
                            <ul className="notification-list">
                                <li className="notification-message">
                                    <a href="activities.html">
                                        <div className="media">
                                            <span className="avatar">
                                                <img alt="John Doe" src={`${import.meta.env.BASE_URL}assets/img/user.jpg`} className="img-fluid" />
                                            </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">John Doe</span> added new task <span className="noti-title">Patient appointment booking</span></p>
                                                <p className="noti-time"><span className="notification-time">4 mins ago</span></p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="notification-message">
                                    <a href="activities.html">
                                        <div className="media">
                                            <span className="avatar">V</span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Tarah Shropshire</span> changed the task name <span className="noti-title">Appointment booking with payment gateway</span></p>
                                                <p className="noti-time"><span className="notification-time">6 mins ago</span></p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="notification-message">
                                    <a href="activities.html">
                                        <div className="media">
                                            <span className="avatar">L</span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Misty Tison</span> added <span className="noti-title">Domenic Houston</span> and <span className="noti-title">Claire Mapes</span> to project <span className="noti-title">Doctor available module</span></p>
                                                <p className="noti-time"><span className="notification-time">8 mins ago</span></p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                               
                                
                            </ul>
                        </div>
                        <div className="topnav-dropdown-footer">
                            <a href="activities.html">View all Notifications</a>
                        </div>
                    </div>
                </li>
                <li className="nav-item dropdown d-none d-sm-block">
                    <a href="javascript:void(0);" id="open_msg_box" className="hasnotifications nav-link"><i className="fa fa-comment-o"></i> <span className="badge badge-pill bg-danger float-right">8</span></a>
                </li>
                <li className="nav-item dropdown has-arrow">
                    <a href="#" className="dropdown-toggle nav-link user-link" data-toggle="dropdown">
                        <span className="user-img">
                            <img className="rounded-circle" src={`${import.meta.env.BASE_URL}assets/img/user.jpg`} width="24" alt="Admin" />
                            <span className= "status online"></span>
                        </span>
                        <span onClick={toggleProfile} style={{ border: "none", borderRadius: "20px", padding: "7px 16px", fontSize: "15px", fontWeight: "500", cursor: "pointer", }}>Admin</span>
                        {openProfile && (
                            <div className="dropdown-menu show" style={{ position: "absolute", top: "100%", right: 0, left: "auto", border: "1px solid black", background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)"}}>
                                <Link className="dropdown-item !text-white hover:!bg-white/20" to="/profile" onClick={() => setOpenProfile(false)} style={{ borderBottom: "1px solid black"}}>
                                    <i className="mdi mdi-account mr-2 text-success"></i>Profile
                                </Link>
                                <Link className="dropdown-item !text-white hover:!bg-white/20" to="/logout" onClick={() => setOpenProfile(false)}>
                                    <i className="mdi mdi-logout mr-2 text-primary"></i>Signout
                                </Link>
                            </div>
                        )}
                    </a>
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href="profile.html">My Profile</a>
                        <a className="dropdown-item" href="edit-profile.html">Edit Profile</a>
                        <a className="dropdown-item" href="settings.html">Settings</a>
                        <a className="dropdown-item" href="login.html">Logout</a>
                    </div>
                </li>
            </ul>
            <div className="dropdown mobile-user-menu float-right">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
                <div className="dropdown-menu dropdown-menu-right">
                    <a className="dropdown-item" href="profile.html">My Profile</a>
                    <a className="dropdown-item" href="edit-profile.html">Edit Profile</a>
                    <a className="dropdown-item" href="settings.html">Settings</a>
                    <a className="dropdown-item" href="login.html">Logout</a>
                </div>
            </div>
        </div>
    )

}
export default Header
