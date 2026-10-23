import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "../LIb/axios.js";

const dashboardComponents = [
    { label: "Medicines", id: "dashboard-medicines" },
    { label: "Sales", id: "dashboard-sales" },
    { label: "Purchase", id: "dashboard-purchase" },
    { label: "Low Stock", id: "dashboard-low-stock" },
    { label: "Sales Analytics", id: "dashboard-sales-analytics" },
    { label: "Top Selling", id: "dashboard-top-selling" },
    { label: "Latest Orders", id: "dashboard-latest-orders" },
    { label: "Stock Alerts", id: "dashboard-stock-alerts" },
    { label: "Revenue By Category", id: "dashboard-revenue-by-category" },
    { label: "New Customers", id: "dashboard-new-customers" },
    { label: "Completed Payment", id: "dashboard-completed-payment" },
    { label: "Pending Payments", id: "dashboard-pending-payments" },
    { label: "Failed Payments", id: "dashboard-failed-payments" },
];

function Header() {
    // const user = JSON.parse(localStorage.getItem("userdata") || "{}");

    const user =JSON.parse(localStorage.getItem("userdata") || "{}");
    const [openProfile, setOpenProfile] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [lowStockMedicines, setLowStockMedicines] = useState([]);
    const [users, setUsers] = useState([]);
    const [isStockLoading, setIsStockLoading] = useState(true);
    const [areUsersLoading, setAreUsersLoading] = useState(true);
    const [stockError, setStockError] = useState("");
    const [usersError, setUsersError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();
    const searchResults = dashboardComponents.filter((component) =>
        component.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    useEffect(() => {
        let isMounted = true;

        const fetchLowStockMedicines = async () => {
            try {
                const response = await axios.get("medicines/index.php");
                if (!Array.isArray(response.data?.data)) {
                    throw new Error("Medicine stock data has an invalid format.");
                }
                if (isMounted) {
                    setLowStockMedicines(
                        response.data.data.filter((medicine) => Number(medicine.stock_qty) <= 10)
                    );
                    setStockError("");
                }
            } catch (error) {
                if (isMounted) {
                    setStockError(error.response?.data?.message || error.message || "Could not load stock alerts.");
                }
            } finally {
                if (isMounted) setIsStockLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get("users/index.php");
                if (!Array.isArray(response.data?.data)) {
                    throw new Error("User data has an invalid format.");
                }
                if (isMounted) {
                    setUsers(response.data.data);
                    setUsersError("");
                }
            } catch (error) {
                if (isMounted) {
                    setUsersError(error.response?.data?.message || error.message || "Could not load users.");
                }
            } finally {
                if (isMounted) setAreUsersLoading(false);
            }
        };

        fetchLowStockMedicines();
        fetchUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    const toggleProfile = () => {
        setOpenProfile(!openProfile);
    };

    const openFirstSearchResult = (event) => {
        if (event.key === "Enter" && searchResults.length > 0) {
            event.preventDefault();
            navigate(`/dashboard#${searchResults[0].id}`);
            setSearchTerm("");
            setIsSearchOpen(false);
        }
        if (event.key === "Escape") {
            setIsSearchOpen(false);
        }
    };

    return (

        <div className="header bg-[linear-gradient(135deg,#0d6efd_0%,#6610f2_100%)]! shadow-[0_4px_16px_rgba(102,16,242,0.35)]">
            <div className="header-left bg-transparent!">
                <a href="index-2.html" className="logo  text-white!">
                    <img src={`${import.meta.env.BASE_URL}assets/img/logo.png`} width="35" height="35" alt="" /> <span>Easmin Pharma</span>
                </a>
            </div>
            <div className="relative float-left ml-[10px] mt-[7px] flex h-9 w-[250px] items-center rounded-md bg-white/90 px-2 shadow-sm max-[767px]:hidden">
                <a
                    id="toggle_btn"
                    href="javascript:void(0);"
                    className="!float-none !inline-flex !h-8 !w-8 !shrink-0 !items-center !justify-center !p-0 !text-base !leading-none !text-[#0d6efd] [&_i]:!text-[#0d6efd]"
                    aria-label="Toggle sidebar"
                >
                    <i className="fa fa-bars" aria-hidden="true"></i>
                </a>
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => {
                        setSearchTerm(event.target.value);
                        setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    onKeyDown={openFirstSearchResult}
                    placeholder="Search dashboard..."
                    aria-label="Search dashboard components"
                    aria-expanded={isSearchOpen && searchTerm.trim().length > 0}
                    aria-controls="dashboard-search-results"
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-500"
                />
                <i
                    className="fa fa-search text-base text-slate-600"
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", lineHeight: 1 }}
                    aria-hidden="true"
                ></i>
                {isSearchOpen && searchTerm.trim() && (
                    <div
                        id="dashboard-search-results"
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg"
                    >
                        {searchResults.length > 0 ? searchResults.map((component) => (
                            <button
                                key={component.id}
                                type="button"
                                role="option"
                                aria-selected="false"
                                onClick={() => {
                                    navigate(`/dashboard#${component.id}`);
                                    setSearchTerm("");
                                    setIsSearchOpen(false);
                                }}
                                className="block w-full border-0 bg-white px-4 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                                {component.label}
                            </button>
                        )) : (
                            <p className="mb-0 px-4 py-2 text-sm text-slate-500">No dashboard components found.</p>
                        )}
                    </div>
                )}
            </div>
            <a id="mobile_btn" className="mobile_btn float-left" href="#sidebar"><i className="fa fa-bars"></i></a>
            <ul className="nav user-menu float-right">
                <li className="nav-item dropdown d-none d-sm-block">
                    <button
                        type="button"
                        className="dropdown-toggle nav-link border-0 bg-transparent text-white"
                        style={{ height: 50, padding: "0 15px", lineHeight: "50px", fontSize: 16, position: "relative", cursor: "pointer" }}
                        aria-label={`Low stock alerts: ${lowStockMedicines.length}`}
                        aria-expanded={isNotificationsOpen}
                        onClick={() => {
                            setIsNotificationsOpen((isOpen) => !isOpen);
                            setIsUsersOpen(false);
                        }}
                    >
                        <i className="fa fa-bell-o" aria-hidden="true"></i>
                        {!isStockLoading && lowStockMedicines.length > 0 && (
                            <span className="badge badge-pill bg-danger" style={{ position: "absolute", right: 3, top: 6, lineHeight: "1" }}>
                                {lowStockMedicines.length}
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div className="dropdown-menu notifications show" style={{ display: "block" }}>
                            <div className="topnav-dropdown-header">
                                <span>Low Stock ({lowStockMedicines.length})</span>
                            </div>
                            <div className="drop-scroll">
                                {isStockLoading ? (
                                    <p className="px-3 py-2 mb-0">Loading stock alerts...</p>
                                ) : stockError ? (
                                    <p className="px-3 py-2 mb-0 text-danger" role="alert">{stockError}</p>
                                ) : lowStockMedicines.length > 0 ? (
                                    <ul className="notification-list">
                                        {lowStockMedicines.map((medicine) => (
                                            <li className="notification-message" key={medicine.id}>
                                                <Link to="/medicines" onClick={() => setIsNotificationsOpen(false)}>
                                                    <div className="media">
                                                        <span className="avatar"><i className="fa fa-medkit" aria-hidden="true"></i></span>
                                                        <div className="media-body">
                                                            <p className="noti-details">
                                                                <span className="noti-title">{medicine.medicine_name}</span>
                                                            </p>
                                                            <p className="noti-time">
                                                                <span className="notification-time">{Number(medicine.stock_qty)} left</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="px-3 py-2 mb-0">No low-stock medicines.</p>
                                )}
                            </div>
                            <div className="topnav-dropdown-footer">
                                <Link to="/medicines" onClick={() => setIsNotificationsOpen(false)}>View medicines</Link>
                            </div>
                        </div>
                    )}
                </li>
                <li className="nav-item dropdown d-none d-sm-block">
                    <button
                        type="button"
                        id="open_msg_box"
                        className="hasnotifications nav-link border-0 bg-transparent text-white"
                        style={{ height: 50, padding: "0 15px", lineHeight: "50px", fontSize: 16, position: "relative", cursor: "pointer" }}
                        aria-label={`Users: ${users.length}`}
                        aria-expanded={isUsersOpen}
                        onClick={() => {
                            setIsUsersOpen((isOpen) => !isOpen);
                            setIsNotificationsOpen(false);
                        }}
                    >
                        <i className="fa fa-comment-o" aria-hidden="true"></i>
                        {!areUsersLoading && (
                            <span className="badge badge-pill bg-danger" style={{ position: "absolute", right: 3, top: 6, lineHeight: "1" }}>
                                {users.length}
                            </span>
                        )}
                    </button>
                    {isUsersOpen && (
                        <div className="dropdown-menu notifications show" style={{ display: "block" }}>
                            <div className="topnav-dropdown-header">
                                <span>Users ({users.length})</span>
                            </div>
                            <div className="drop-scroll">
                                {areUsersLoading ? (
                                    <p className="px-3 py-2 mb-0">Loading users...</p>
                                ) : usersError ? (
                                    <p className="px-3 py-2 mb-0 text-danger" role="alert">{usersError}</p>
                                ) : users.length > 0 ? (
                                    <ul className="notification-list">
                                        {users.map((account) => (
                                            <li className="notification-message" key={account.id}>
                                                <Link to="/users" onClick={() => setIsUsersOpen(false)}>
                                                    <div className="media">
                                                        <span className="avatar">{(account.name || account.email || "U").charAt(0).toUpperCase()}</span>
                                                        <div className="media-body">
                                                            <p className="noti-details">
                                                                <span className="noti-title">{account.name || "Unnamed user"}</span>
                                                            </p>
                                                            <p className="noti-time">
                                                                <span className="notification-time">
                                                                    {[account.email, account.mobile].filter(Boolean).join(" | ") || "No contact details"}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="px-3 py-2 mb-0">No users found.</p>
                                )}
                            </div>
                            <div className="topnav-dropdown-footer">
                                <Link to="/users" onClick={() => setIsUsersOpen(false)}>View all users</Link>
                            </div>
                        </div>
                    )}
                </li>
                <li className="nav-item dropdown has-arrow">
                    <a href="#" className="dropdown-toggle nav-link user-link" data-toggle="dropdown">
                        <span className="user-img">
                            <img className="rounded-circle" src={`${import.meta.env.BASE_URL}assets/img/user.jpg`} width="24" alt="Admin" />
                            <span className= "status online"></span>
                        </span>
                        <span onClick={toggleProfile} style={{ border: "none", borderRadius: "20px", padding: "7px 16px", fontSize: "15px", fontWeight: "500", cursor: "pointer", }}>{user.name || "Admin"}</span>
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
