import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router";
import Layout from "../Layout.jsx";
import api from "../../LIb/axios.js";
import AccountsCreate from "./create.jsx";

const sectionLabels = {
  heads: "Account Heads",
  journal: "Journal Voucher",
  receive: "Receive Voucher",
  payment: "Payment Voucher",
  ledger: "Ledger",
  "profit-loss": "Profit & Loss",
};

const today = () => new Date().toISOString().slice(0, 10);
const firstDayOfMonth = () => `${today().slice(0, 7)}-01`;
const money = (value) => Number(value || 0).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function Accounts() {
  const { section = "heads" } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [ledger, setLedger] = useState({ rows: [], opening_balance: "0.00", closing_balance: "0.00" });
  const [profitLoss, setProfitLoss] = useState({ rows: [], income: "0.00", expense: "0.00", net_profit: "0.00" });
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [reportFilters, setReportFilters] = useState({
    from: firstDayOfMonth(),
    to: today(),
    account_id: "",
  });

  const pageTitle = sectionLabels[section] || "Accounts";
  const request = useCallback(async (url, config) => {
    const response = await api(url, config);
    if (!response.data?.status) {
      throw new Error(response.data?.message || "Request failed");
    }
    return response.data.data;
  }, []);

  const loadAccounts = useCallback(async () => {
    const result = await request("accounts/index.php?view=accounts");
    setAccounts(result);
  }, [request]);

  const loadVouchers = useCallback(async () => {
    const result = await request("accounts/index.php?view=vouchers");
    setVouchers(result);
  }, [request]);

  useEffect(() => {
    loadAccounts().catch((error) => setFormError(error.message));
    if (["journal", "receive", "payment"].includes(section)) {
      loadVouchers().catch((error) => setFormError(error.message));
    }
  }, [section, refreshKey, loadAccounts, loadVouchers]);

  const postVoucher = async (voucher) => {
    if (!window.confirm(`Post voucher ${voucher.voucher_no}? Posted vouchers appear in Ledger and Profit & Loss.`)) {
      return;
    }
    setBusy(true);
    setFormError("");
    setNotice("");
    try {
      const form = new FormData();
      form.set("voucher_type", voucher.voucher_type);
      form.set("id", voucher.id);
      await request("accounts/update.php", { method: "POST", data: form });
      setNotice(`${voucher.voucher_no} posted.`);
      await loadVouchers();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const loadLedger = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFormError("");
    try {
      const params = new URLSearchParams(reportFilters);
      const result = await request(`accounts/index.php?view=ledger&${params.toString()}`);
      setLedger(result);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const loadProfitLoss = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFormError("");
    try {
      const params = new URLSearchParams({ from: reportFilters.from, to: reportFilters.to });
      const result = await request(`accounts/index.php?view=profit_loss&${params.toString()}`);
      setProfitLoss(result);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const navClass = ({ isActive }) => (
    `btn btn-sm mr-2 mb-2 ${isActive ? "btn-primary" : "btn-outline-primary"}`
  );
  const currentTypeVouchers = vouchers.filter((voucher) => voucher.voucher_type === section);

  return (
    <Layout>
      <div className="page-wrapper">
        <div className="content">
          <div className="row align-items-center mb-3">
            <div className="col-sm-7"><h4 className="page-title">{pageTitle}</h4></div>
            <div className="col-sm-5 text-right">
              <Link to="/accounts/heads" className="btn btn-outline-primary btn-sm">Accounts Home</Link>
            </div>
          </div>

          <div className="mb-3" aria-label="Accounts sections">
            {Object.entries(sectionLabels).map(([key, label]) => (
              <NavLink key={key} to={`/accounts/${key}`} className={navClass}>{label}</NavLink>
            ))}
          </div>

          {formError && <div className="alert alert-danger" role="alert">{formError}</div>}
          {notice && <div className="alert alert-success" role="status">{notice}</div>}

          {["heads", "journal", "receive", "payment"].includes(section) && (
            <AccountsCreate
              section={section}
              accounts={accounts}
              onSaved={() => setRefreshKey((key) => key + 1)}
              onError={setFormError}
              onNotice={setNotice}
            />
          )}

          {section === "heads" && (
            <div className="table-responsive">
              <table className="table table-striped custom-table">
                <thead><tr><th>Code</th><th>Account</th><th>Type</th><th>Parent</th><th>Opening</th><th>Status</th></tr></thead>
                <tbody>
                  {accounts.length === 0 && <tr><td colSpan="6" className="text-center">No account heads found.</td></tr>}
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td>{account.account_code}</td>
                      <td>{account.account_name}</td>
                      <td>{account.account_type}</td>
                      <td>{accounts.find((candidate) => Number(candidate.id) === Number(account.parent_id))?.account_name || "—"}</td>
                      <td>{money(account.opening_balance)}</td>
                      <td>{account.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {["journal", "receive", "payment"].includes(section) && (
            <div className="table-responsive">
              <table className="table table-striped custom-table">
                <thead><tr><th>Voucher No.</th><th>Date</th><th>Narration</th><th>Debit</th><th>Credit</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {currentTypeVouchers.length === 0 && <tr><td colSpan="7" className="text-center">No vouchers found.</td></tr>}
                  {currentTypeVouchers.map((voucher) => (
                    <tr key={`${voucher.voucher_type}-${voucher.id}`}>
                      <td>{voucher.voucher_no}</td>
                      <td>{voucher.voucher_date}</td>
                      <td>{voucher.narration}</td>
                      <td>{money(voucher.dr)}</td>
                      <td>{money(voucher.cr)}</td>
                      <td className="text-capitalize">{voucher.status}</td>
                      <td>
                        {voucher.status === "draft" && (
                          <button type="button" className="btn btn-sm btn-success" disabled={busy} onClick={() => postVoucher(voucher)}>
                            Post
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section === "ledger" && (
            <>
              <form className="card card-body mb-3" onSubmit={loadLedger}>
                <div className="row align-items-end">
                  <div className="form-group col-md-4">
                    <label htmlFor="ledger_account">Account</label>
                    <select
                      id="ledger_account"
                      className="form-control"
                      value={reportFilters.account_id}
                      onChange={(event) => setReportFilters((filters) => ({ ...filters, account_id: event.target.value }))}
                      required
                    >
                      <option value="">Select account</option>
                      {accounts.map((account) => (
                        <option value={account.id} key={account.id}>{account.account_code} — {account.account_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="ledger_from">From</label>
                    <input id="ledger_from" className="form-control" type="date" value={reportFilters.from} onChange={(event) => setReportFilters((filters) => ({ ...filters, from: event.target.value }))} required />
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="ledger_to">To</label>
                    <input id="ledger_to" className="form-control" type="date" value={reportFilters.to} onChange={(event) => setReportFilters((filters) => ({ ...filters, to: event.target.value }))} required />
                  </div>
                  <div className="form-group col-md-2"><button className="btn btn-primary" disabled={busy}>Show Ledger</button></div>
                </div>
              </form>
              <p><strong>Opening balance:</strong> {money(ledger.opening_balance)} &nbsp; <strong>Closing balance:</strong> {money(ledger.closing_balance)}</p>
              <div className="table-responsive">
                <table className="table table-striped custom-table">
                  <thead><tr><th>Date</th><th>Voucher</th><th>Remarks</th><th>Debit</th><th>Credit</th><th>Running balance</th></tr></thead>
                  <tbody>
                    {ledger.rows.length === 0 && <tr><td colSpan="6" className="text-center">Choose an account and date range to view posted entries.</td></tr>}
                    {ledger.rows.map((row) => (
                      <tr key={`${row.voucher_type}-${row.detail_id}`}>
                        <td>{row.voucher_date}</td><td>{row.voucher_no}</td><td>{row.remarks}</td>
                        <td>{money(row.dr)}</td><td>{money(row.cr)}</td><td>{money(row.running_balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {section === "profit-loss" && (
            <>
              <form className="card card-body mb-3" onSubmit={loadProfitLoss}>
                <div className="row align-items-end">
                  <div className="form-group col-md-4">
                    <label htmlFor="pl_from">From</label>
                    <input id="pl_from" className="form-control" type="date" value={reportFilters.from} onChange={(event) => setReportFilters((filters) => ({ ...filters, from: event.target.value }))} required />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="pl_to">To</label>
                    <input id="pl_to" className="form-control" type="date" value={reportFilters.to} onChange={(event) => setReportFilters((filters) => ({ ...filters, to: event.target.value }))} required />
                  </div>
                  <div className="form-group col-md-4"><button className="btn btn-primary" disabled={busy}>Run Profit &amp; Loss</button></div>
                </div>
              </form>
              <div className="row mb-3">
                <div className="col-md-4"><div className="card card-body"><strong>Total Income</strong><span>{money(profitLoss.income)}</span></div></div>
                <div className="col-md-4"><div className="card card-body"><strong>Total Expense</strong><span>{money(profitLoss.expense)}</span></div></div>
                <div className="col-md-4">
                  <div className="card card-body">
                    <strong>Net {Number(profitLoss.net_profit) < 0 ? "Loss" : "Profit"}</strong>
                    <span>{money(Math.abs(Number(profitLoss.net_profit)))}</span>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped custom-table">
                  <thead><tr><th>Code</th><th>Account</th><th>Type</th><th>Income / Expense</th></tr></thead>
                  <tbody>
                    {profitLoss.rows.length === 0 && <tr><td colSpan="4" className="text-center">Choose a date range to view posted income and expenses.</td></tr>}
                    {profitLoss.rows.map((row) => (
                      <tr key={row.id}><td>{row.account_code}</td><td>{row.account_name}</td><td>{row.account_type}</td><td>{money(row.net_amount)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Accounts;
