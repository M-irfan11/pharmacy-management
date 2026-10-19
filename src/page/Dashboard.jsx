import { Link } from "react-router"
import { useEffect, useState } from "react"
import { Bar, Doughnut } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
} from "chart.js"
import Layout from './Layout.jsx'
import axios from '../LIb/axios.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip)

// ---- Revenue By Category (donut) data ----
const categoryLabels = ['Pain Relief', 'Vitamins', 'Antibiotics']
const categoryGradients = [
    ['#00e0c0', '#009ec3'],
    ['#ff8fb8', '#ff3d77'],
    ['#d4f55a', '#5ccf1f'],
]
const makeGradient = (context, i) => {
    const { ctx, chartArea } = context.chart
    if (!chartArea) return categoryGradients[i][0]
    const g = ctx.createLinearGradient(chartArea.left, chartArea.top, chartArea.right, chartArea.bottom)
    g.addColorStop(0, categoryGradients[i][0])
    g.addColorStop(1, categoryGradients[i][1])
    return g
}
const revenueByPeriod = {
    'Monthly': [380, 310, 160],
    'Weekly': [90, 70, 40],
    'Yearly': [4200, 3600, 1900],
}
const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: { legend: { display: false } },
}

// ---- Sales Analytics chart data ----
const months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Set', 'Oct', 'Nov', 'Dec']
const barColors = [
    '#67b7dc', '#6794dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc',
    '#dc67ce', '#dc67ab', '#dc6788', '#dc6967', '#dc8c67', '#dcaf67',
]
const salesByPeriod = {
    'This Month': [720, 850, 600, 510, 320, 750, 205, 350, 165, 300, 500, 800],
    'Last Month': [650, 700, 540, 480, 410, 620, 300, 280, 220, 340, 450, 700],
    'This Year': [900, 950, 800, 700, 560, 880, 420, 510, 330, 470, 640, 960],
}
const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: { beginAtZero: true, max: 1000, ticks: { stepSize: 200 }, grid: { color: '#e9e9e9' } },
        x: { grid: { color: '#e9e9e9' } },
    },
    barPercentage: 0.7,
    categoryPercentage: 0.8,
}

const statCards = [
    { key: 'total_medicines', bg: 'dash-widget-bg1', title: 'widget-title1', icon: 'fa fa-medkit', label: 'Medicines', gradient: '!bg-gradient-to-br from-[#0d6efd] to-[#6610f2]' },
    { key: 'total_sales', bg: 'dash-widget-bg2', title: 'widget-title2', icon: 'fa fa-shopping-bag', label: 'Sales', gradient: '!bg-gradient-to-br from-[#55ce63] to-[#28a745]', isAmount: true },
    { key: 'total_purchase', bg: 'dash-widget-bg3', title: 'widget-title3', icon: 'fa fa-shopping-cart', label: 'Purchase', gradient: '!bg-gradient-to-br from-[#7a92a3] to-[#5c7383]', isAmount: true },
    { key: 'low_stock_count', bg: 'dash-widget-bg4', title: 'widget-title4', icon: 'fa fa-exclamation-triangle', label: 'Low Stock', gradient: '!bg-gradient-to-br from-[#ffbc35] to-[#ff9800]' },
]

const latestOrders = [
    { id: '#ORD121', medicine: 'Metformin', price: '$10.50', status: 'Delivered' },
    { id: '#ORD122', medicine: 'Paracetamol 500mg', price: '$4.20', status: 'Pending' },
    { id: '#ORD123', medicine: 'Amoxicillin', price: '$12.00', status: 'Delivered' },
    { id: '#ORD124', medicine: 'Omeprazole', price: '$8.75', status: 'Cancelled' },
    { id: '#ORD125', medicine: 'Cetirizine', price: '$3.90', status: 'Pending' },
]

const statusClass = {
    Delivered: 'btn-primary-three',
    Pending: 'btn-primary-four',
    Cancelled: 'btn-primary-two',
}

const stockAlerts = [
    { name: 'Paracetamol 500mg', note: 'Only 12 strips left', tag: 'Low', icon: 'fa fa-medkit', grad: 'linear-gradient(135deg, #ff8fb8, #ff3d77)', color: '#ef3b5d', tagBg: '#fdeaea' },
    { name: 'Insulin Glargine', note: 'Expires in 15 days', tag: 'Expiring', icon: 'fa fa-eyedropper', grad: 'linear-gradient(135deg, #ffd452, #f59e0b)', color: '#d98200', tagBg: '#fff6dc' },
    { name: 'Amoxicillin 250mg', note: 'Only 20 strips left', tag: 'Low', icon: 'fa fa-flask', grad: 'linear-gradient(135deg, #ff8fb8, #ff3d77)', color: '#ef3b5d', tagBg: '#fdeaea' },
    { name: 'Salbutamol Inhaler', note: 'Expires in 1 month', tag: 'Expiring', icon: 'fa fa-heartbeat', grad: 'linear-gradient(135deg, #ffd452, #f59e0b)', color: '#d98200', tagBg: '#fff6dc' },
    { name: 'Vitamin D3', note: 'Stock is healthy', tag: 'In stock', icon: 'fa fa-plus-square', grad: 'linear-gradient(135deg, #43e97b, #11b76b)', color: '#11b76b', tagBg: '#e5f9ee' },
]

const payments = [
    { title: 'Completed Payment', revenue: '$25,000', count: 200, icon: 'fa fa-check', color: '#11b76b', grad: 'linear-gradient(135deg, #43e97b, #11b76b)', glow: 'rgba(17,183,107,0.35)' },
    { title: 'Pending Payments', revenue: '$10,000', count: 40, icon: 'fa fa-exclamation-triangle', color: '#f59e0b', grad: 'linear-gradient(135deg, #ffd452, #f59e0b)', glow: 'rgba(245,158,11,0.35)' },
    { title: 'Failed Payments', revenue: '$5,000', count: 5, icon: 'fa fa-times', color: '#ef3b5d', grad: 'linear-gradient(135deg, #ff7a8a, #ef3b5d)', glow: 'rgba(239,59,93,0.35)' },
]

const messages = [
    { letter: 'S', author: 'Supplier - MediCorp', time: '12:28 AM', text: 'Your order #SUP-882 has been shipped.' },
    { letter: 'R', author: 'Richard Miles', time: '1 Aug', text: 'Please confirm the new stock list.', isNew: true },
    { letter: 'T', author: 'Tarah Shropshire', time: '12:28 AM', text: 'Invoice for last month is ready.' },
]

function Dashboard() {
    const [period, setPeriod] = useState('This Month')
    const [revPeriod, setRevPeriod] = useState('Monthly')
    const [summary, setSummary] = useState({
        total_medicines: 0,
        total_sales: 0,
        total_purchase: 0,
        low_stock_count: 0,
    })
    const [topSelling, setTopSelling] = useState([])
    const [dashboardError, setDashboardError] = useState('')

    useEffect(() => {
        const fetchDashboardSummary = async () => {
            try {
                const response = await axios.get('/dashboard/summary.php')
                if (!response.data?.status) {
                    throw new Error(response.data?.message || 'Could not load dashboard data.')
                }
                setSummary(response.data.data.summary)
                setTopSelling(response.data.data.top_selling)
                setDashboardError('')
            } catch (error) {
                setDashboardError(error.response?.data?.message || error.message || 'Could not load dashboard data.')
            }
        }

        fetchDashboardSummary()

        const refreshOnReturn = () => {
            if (document.visibilityState === 'visible') {
                fetchDashboardSummary()
            }
        }
        window.addEventListener('focus', refreshOnReturn)
        document.addEventListener('visibilitychange', refreshOnReturn)

        return () => {
            window.removeEventListener('focus', refreshOnReturn)
            document.removeEventListener('visibilitychange', refreshOnReturn)
        }
    }, [])

    const revenueValues = revenueByPeriod[revPeriod]
    const totalRevenue = revenueValues.reduce((a, b) => a + b, 0)
    const donutData = {
        labels: categoryLabels,
        datasets: [{
            data: revenueValues,
            backgroundColor: (context) => makeGradient(context, context.dataIndex),
            borderColor: '#fff',
            borderWidth: 4,
            borderRadius: 8,
            hoverOffset: 10,
        }],
    }

    const salesData = {
        labels: months,
        datasets: [{
            data: salesByPeriod[period],
            backgroundColor: barColors,
            borderRadius: 2,
        }],
    }

    return (
        <Layout>
            <div className="page-wrapper !pt-[50px]">
                <div className="content">

                    {/* ===== Top stat widgets ===== */}
                    {dashboardError && (
                        <div className="alert alert-danger" role="alert">
                            Dashboard data could not be loaded: {dashboardError}
                        </div>
                    )}
                    <div className="row">
                        {statCards.map((s) => (
                            <div key={s.label} className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                                <div className="dash-widget">
                                    <span className={`${s.bg} ${s.gradient}`}><i className={s.icon} aria-hidden="true"></i></span>
                                    <div className="dash-widget-info text-right">
                                        <h3>{s.isAmount
                                            ? Number(summary[s.key]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : Number(summary[s.key]).toLocaleString('en-US')}</h3>
                                        <span className={`${s.title} ${s.gradient}`}>{s.label} <i className="fa fa-check" aria-hidden="true"></i></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ===== Sales Analytics + Top Selling ===== */}
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-8 col-xl-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="chart-title">
                                        <h4>Sales Analytics</h4>
                                        <select
                                            className="form-control form-control-sm float-right"
                                            style={{ width: 'auto', borderRadius: '20px', fontSize: '12px' }}
                                            value={period}
                                            onChange={(e) => setPeriod(e.target.value)}
                                        >
                                            {Object.keys(salesByPeriod).map((p) => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ height: '300px' }}>
                                        <Bar data={salesData} options={salesOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="chart-title">
                                        <h4>Top Selling</h4>
                                        <div className="float-right">
                                            <ul className="chat-user-total">
                                                <li><i className="fa fa-circle current-users" aria-hidden="true"></i> This Month</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="bar-chart">
                                        <div className="chart clearfix">
                                            {topSelling.length === 0 && (
                                                <p className="text-center text-muted mb-0">No sales this month</p>
                                            )}
                                            {topSelling.map((m) => (
                                                <div className="item" key={m.name}>
                                                    <div className="bar !bg-gradient-to-br from-[#ffbc35] to-[#ff9800]">
                                                        <span className="percent">{m.percent}% ({m.quantity})</span>
                                                        <div className="item-progress !bg-gradient-to-br from-[#ffbc35] to-[#ff9800]" data-percent={m.percent}>
                                                            <span className="title">{m.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== Latest Orders + Stock Alerts ===== */}
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-8 col-xl-8">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title d-inline-block">Latest Orders</h4>
                                    <Link to="/orders" className="btn btn-primary float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">View all</Link>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Order Id</th>
                                                    <th>Medicine Name</th>
                                                    <th>Price</th>
                                                    <th>Status</th>
                                                    <th className="text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {latestOrders.map((o) => (
                                                    <tr key={o.id}>
                                                        <td>{o.id}</td>
                                                        <td>
                                                            <i className="fa fa-medkit" aria-hidden="true"></i> {o.medicine}
                                                        </td>
                                                        <td>{o.price}</td>
                                                        <td>
                                                            <button className={`btn btn-primary ${statusClass[o.status]} hover:!bg-gradient-to-br hover:from-[#0d6efd] hover:to-[#6610f2] hover:!text-white hover:!border-transparent`}>{o.status}</button>
                                                        </td>
                                                        <td className="text-right">
                                                            <a href="#" className="m-r-10"><i className="fa fa-eye" aria-hidden="true"></i></a>
                                                            <a href="#" className="m-r-10"><i className="fa fa-pencil" aria-hidden="true"></i></a>
                                                            <a href="#"><i className="fa fa-trash-o" aria-hidden="true"></i></a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                            <div className="card member-panel">
                                <div className="card-header bg-white">
                                    <h4 className="card-title mb-0">Stock Alerts</h4>
                                </div>
                                <div className="card-body">
                                    <ul className="contact-list">
                                        {stockAlerts.map((m) => (
                                            <li key={m.name}>
                                                <div className="contact-cont d-flex align-items-center">
                                                    <span
                                                        className="d-inline-flex align-items-center justify-content-center rounded-circle m-r-10"
                                                        style={{
                                                            width: '42px', height: '42px', flexShrink: 0, background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)',
                                                            color: '#fff', fontSize: '17px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                                        }}
                                                    >
                                                        <i className={m.icon} aria-hidden="true"></i>
                                                    </span>
                                                    <div className="contact-info" style={{ flex: 1, minWidth: 0 }}>
                                                        <span className="contact-name text-ellipsis" style={{ fontWeight: 500 }}>{m.name}</span>
                                                        <span className="contact-date">{m.note}</span>
                                                    </div>
                                                    <span
                                                        style={{
                                                            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px',
                                                            background: m.tagBg, color: m.color, whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {m.tag}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="card-footer text-center bg-white">
                                    <Link to="/medicines" className="text-muted">View all Medicines</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== Orders chart + Customers ===== */}
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-6 col-xl-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="chart-title">
                                        <h4>Revenue By Category</h4>
                                        <select
                                            className="form-control form-control-sm float-right"
                                            style={{ width: 'auto', borderRadius: '20px', fontSize: '12px' }}
                                            value={revPeriod}
                                            onChange={(e) => setRevPeriod(e.target.value)}
                                        >
                                            {Object.keys(revenueByPeriod).map((p) => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ position: 'relative', height: '220px' }}>
                                        <Doughnut data={donutData} options={donutOptions} />
                                        <div
                                            className="text-center"
                                            style={{
                                                position: 'absolute', top: '50%', left: '50%',
                                                transform: 'translate(-50%, -50%)', pointerEvents: 'none',
                                            }}
                                        >
                                            <h3 className="mb-0" style={{ fontWeight: 700, fontSize: '28px', color: '#009ec3' }}>${totalRevenue.toLocaleString()}</h3>
                                            <span className="text-muted" style={{ fontSize: '13px' }}>Revenue</span>
                                        </div>
                                    </div>
                                    <ul className="list-inline text-center mt-3 mb-0" style={{ fontSize: '13px', fontWeight: 500 }}>
                                        {categoryLabels.map((label, i) => (
                                            <li key={label} className="list-inline-item m-r-10">
                                                <span
                                                    style={{
                                                        display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
                                                        marginRight: '6px',
                                                        background: `linear-gradient(135deg, ${categoryGradients[i][0]}, ${categoryGradients[i][1]})`,
                                                    }}
                                                ></span>
                                                {label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-6 col-xl-6">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title d-inline-block">New Customers</h4>
                                    <Link to="/customers" className="btn btn-primary float-right !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0">View all</Link>
                                </div>
                                <div className="card-block">
                                    <div className="table-responsive">
                                        <table className="table mb-0 new-patient-table">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <img width="28" height="28" className="rounded-circle" src="assets/img/user.jpg" alt="" />
                                                        <h2>John Doe</h2>
                                                    </td>
                                                    <td>johndoe21@gmail.com</td>
                                                    <td>+1-202-555-0125</td>
                                                    <td><button className="btn btn-primary btn-primary-one float-right hover:!bg-gradient-to-br hover:from-[#0d6efd] hover:to-[#6610f2] hover:!text-white hover:!border-transparent">Regular</button></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <img width="28" height="28" className="rounded-circle" src="assets/img/user.jpg" alt="" />
                                                        <h2>Richard</h2>
                                                    </td>
                                                    <td>richard123@yahoo.com</td>
                                                    <td>202-555-0127</td>
                                                    <td><button className="btn btn-primary btn-primary-two float-right hover:!bg-gradient-to-br hover:from-[#0d6efd] hover:to-[#6610f2] hover:!text-white hover:!border-transparent">Wholesale</button></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <img width="28" height="28" className="rounded-circle" src="assets/img/user.jpg" alt="" />
                                                        <h2>William</h2>
                                                    </td>
                                                    <td>william@yahoo.com</td>
                                                    <td>+1-202-555-0106</td>
                                                    <td><button className="btn btn-primary btn-primary-three float-right hover:!bg-gradient-to-br hover:from-[#0d6efd] hover:to-[#6610f2] hover:!text-white hover:!border-transparent">Regular</button></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <img width="28" height="28" className="rounded-circle" src="assets/img/user.jpg" alt="" />
                                                        <h2>Martin</h2>
                                                    </td>
                                                    <td>martin@yahoo.com</td>
                                                    <td>776-2323 89562015</td>
                                                    <td><button className="btn btn-primary btn-primary-four float-right hover:!bg-gradient-to-br hover:from-[#0d6efd] hover:to-[#6610f2] hover:!text-white hover:!border-transparent">Walk-in</button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== Payment summary cards ===== */}
                    <div className="row">
                        {payments.map((p) => (
                            <div key={p.title} className="col-12 col-md-6 col-lg-4 col-xl-4">
                                <div className="card" style={{ borderTop: `4px solid ${p.color}`, boxShadow: `0 6px 18px ${p.glow}` }}>
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center">
                                                <span
                                                    className="d-inline-flex align-items-center justify-content-center rounded-circle m-r-10"
                                                    style={{ width: '46px', height: '46px', background: p.grad, color: '#fff', fontSize: '18px', boxShadow: `0 4px 10px ${p.glow}` }}
                                                >
                                                    <i className={p.icon} aria-hidden="true"></i>
                                                </span>
                                                <h5 className="mb-0" style={{ fontSize: '15px', fontWeight: 600 }}>{p.title}</h5>
                                            </div>
                                            <a href="#" className="text-muted"><i className="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                                        </div>
                                        <p className="mb-1" style={{ fontSize: '13px' }}>Revenue: <strong style={{ color: p.color }}>{p.revenue}</strong></p>
                                        <h2 className="mb-1" style={{ fontSize: '38px', fontWeight: 700, color: p.color }}>{p.count}</h2>
                                        <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>Since Last Week</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ===== Footer ===== */}
                    {/* <div className="d-flex justify-content-between align-items-center pb-3" style={{ fontSize: '13px' }}>
                        
                        
                    </div> */}
                </div>

                {/* ===== Messages sidebar (template er moto) ===== */}
                <div className="notification-box">
                    <div className="msg-sidebar notifications msg-noti">
                        <div className="topnav-dropdown-header">
                            <span>Messages</span>
                        </div>
                        <div className="drop-scroll msg-list-scroll" id="msg_list">
                            <ul className="list-box">
                                {messages.map((m) => (
                                    <li key={m.author}>
                                        <Link to="/chat">
                                            <div className={`list-item ${m.isNew ? 'new-message' : ''}`}>
                                                <div className="list-left">
                                                    <span className="avatar">{m.letter}</span>
                                                </div>
                                                <div className="list-body">
                                                    <span className="message-author">{m.author}</span>
                                                    <span className="message-time">{m.time}</span>
                                                    <div className="clearfix"></div>
                                                    <span className="message-content">{m.text}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="topnav-dropdown-footer">
                            <Link to="/chat">See all messages</Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard;