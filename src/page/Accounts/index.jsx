import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useParams, useSearchParams } from "react-router";
import Layout from "../Layout.jsx";
import api from "../../LIb/axios.js";
import { accountCodeLabel } from "../../accountCodeLabel.js";
import AccountsCreate from "./create.jsx";

const sectionLabels = {
  heads: "Account Heads",
  journal: "Journal Voucher",
  receive: "Receive Voucher",
  payment: "Payment Voucher",
  ledger: "Ledger",
  "profit-loss": "Profit & Loss",
};

const money = (value) => Number(value || 0).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function Accounts() {
  const { section = "heads" } = useParams();
  const [searchParams] = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [ledger, setLedger] = useState({ rows: [], opening_balance: "0.00", closing_balance: "0.00" });
  const [profitLoss, setProfitLoss] = useState({ rows: [], income: "0.00", expense: "0.00", net_profit: "0.00" });
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [creatingVoucher, setCreatingVoucher] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState("");
  const ledgerAccountParam = searchParams.get("account_id") || "";

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

  const fetchProfitLoss = useCallback(async () => {
    const result = await request("accounts/index.php?view=profit_loss");
    setProfitLoss(result);
  }, [request]);

  useEffect(() => {
    setCreatingAccount(false);
    setEditingAccount(null);
    setCreatingVoucher(false);
    setEditingVoucher(null);
    loadAccounts().catch((error) => setFormError(error.message));
    if (["journal", "receive", "payment"].includes(section)) {
      loadVouchers().catch((error) => setFormError(error.message));
    }
  }, [section, refreshKey, loadAccounts, loadVouchers]);

  useEffect(() => {
    if (section === "profit-loss") {
      fetchProfitLoss().catch((error) => setFormError(error.message));
    }
  }, [section, fetchProfitLoss]);

  const editVoucher = async (voucher) => {
    setBusy(true);
    setFormError("");
    setNotice("");
    try {
      const result = await request(
        `accounts/index.php?view=single&type=${voucher.voucher_type}&id=${voucher.id}`,
      );
      setEditingVoucher(result[0]);
      setCreatingVoucher(true);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteVoucher = async (voucher) => {
    if (!window.confirm(`Delete voucher ${voucher.voucher_no}?`)) {
      return;
    }
    setBusy(true);
    setFormError("");
    setNotice("");
    try {
      const form = new FormData();
      form.set("type", voucher.voucher_type);
      form.set("id", voucher.id);
      await request("accounts/delete.php", { method: "POST", data: form });
      setNotice(`${voucher.voucher_no} deleted.`);
      await loadVouchers();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteAccount = async (account) => {
    if (!window.confirm(`Delete account head ${account.account_code} — ${account.account_name}? Accounts used by vouchers or with child accounts cannot be deleted.`)) {
      return;
    }
    setBusy(true);
    setFormError("");
    setNotice("");
    try {
      const form = new FormData();
      form.set("type", "account");
      form.set("id", account.id);
      await request("accounts/delete.php", { method: "POST", data: form });
      setNotice(`Account head ${account.account_code} deleted.`);
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const loadLedger = useCallback(async (accountId) => {
    setSelectedLedgerAccount(accountId);
    setLedger({ rows: [], opening_balance: "0.00", closing_balance: "0.00" });
    if (!accountId) {
      return;
    }
    setBusy(true);
    setFormError("");
    try {
      const params = new URLSearchParams({ account_id: accountId });
      const result = await request(`accounts/index.php?view=ledger&${params.toString()}`);
      setLedger(result);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  }, [request]);

  useEffect(() => {
    if (section === "ledger" && ledgerAccountParam) {
      loadLedger(ledgerAccountParam);
    }
  }, [section, ledgerAccountParam, loadLedger]);

  const editAccount = async (account) => {
    setBusy(true);
    setFormError("");
    setNotice("");
    try {
      const result = await request(`accounts/index.php?view=single&type=account&id=${account.id}`);
      setEditingAccount(result[0]);
      setCreatingAccount(true);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const navClass = ({ isActive }) => (
    `btn btn-sm mr-2 mb-2 ${isActive ? "!bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0" : "btn-outline-primary"}`
  );
  const currentTypeVouchers = vouchers.filter((voucher) => voucher.voucher_type === section);

  return (
    <Layout>
      <div className="page-wrapper">
        <div className="content">
          <div className="row align-items-center mb-3">
            <div className="col-sm-7"><h4 className="page-title">{pageTitle}</h4></div>
            <div className="col-sm-5 text-right">
              <Link to="/accounts/heads" className="btn  btn-sm">Accounts Home</Link>
            </div>
          </div>

          <div className="mb-3" aria-label="Accounts sections">
            {Object.entries(sectionLabels).map(([key, label]) => (
              <NavLink key={key} to={`/accounts/${key}`} className={navClass}>{label}</NavLink>
            ))}
          </div>

          {formError && <div className="alert alert-danger" role="alert">{formError}</div>}
          {notice && <div className="alert alert-success" role="status">{notice}</div>}

          {section === "heads" && !creatingAccount && (
            <div className="mb-3">
              <button
                type="button"
                className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
                onClick={() => {
                  setEditingAccount(null);
                  setCreatingAccount(true);
                }}
              >
                + Add Account
              </button>
            </div>
          )}

          {["journal", "receive", "payment"].includes(section) && !creatingVoucher && (
            <div className="mb-3">
              <button
                type="button"
                className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0"
                onClick={() => setCreatingVoucher(true)}
              >
                Add {section === "journal" ? "Journal" : section === "receive" ? "Receive" : "Payment"}
              </button>
            </div>
          )}

          {(["journal", "receive", "payment"].includes(section) ? creatingVoucher : section === "heads" && creatingAccount) && (
            <AccountsCreate
              section={section}
              accounts={accounts}
              account={editingAccount}
              key={editingVoucher?.id || editingAccount?.id || `new-${section}`}
              voucher={editingVoucher}
              onSaved={() => {
                setRefreshKey((key) => key + 1);
                setCreatingAccount(false);
                setEditingAccount(null);
                setCreatingVoucher(false);
                setEditingVoucher(null);
              }}
              onCancel={() => {
                setCreatingAccount(false);
                setEditingAccount(null);
                setCreatingVoucher(false);
                setEditingVoucher(null);
              }}
              onError={setFormError}
              onNotice={setNotice}
            />
          )}

          {section === "heads" && !creatingAccount && (
            <div className="table-responsive">
              <table className="table table-striped custom-table">
                <thead><tr><th>Code</th><th>Name</th><th>Type</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {accounts.length === 0 && <tr><td colSpan="6" className="text-center">No account heads found.</td></tr>}
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td>{accountCodeLabel(account.account_code)}</td>
                      <td>{account.account_name}</td>
                      <td>{account.account_type}</td>
                      <td>{money(account.opening_balance)}</td>
                      <td>{account.status}</td>
                      <td>
                        <Link
                          className="btn btn-sm !bg-gradient-to-br from-[#008FAA] to-[#000FAA] !text-white border-0 mr-1"
                          to={`/accounts/ledger?account_id=${account.id}`}
                        >
                          Ledger
                        </Link>
                        <button
                          className="btn btn-sm !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0 mr-1"
                          type="button"
                          disabled={busy}
                          onClick={() => editAccount(account)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm !bg-gradient-to-br from-[#D60000] to-[#B70000] !text-white border-0 mr-1"
                          type="button"
                          disabled={busy}
                          onClick={() => deleteAccount(account)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {["journal", "receive", "payment"].includes(section) && !creatingVoucher && (
            <div className="table-responsive">
              <table className="table table-striped custom-table">
                <thead><tr><th>Voucher No.</th><th>Date</th><th>Narration</th><th>Debit</th><th>Credit</th><th>Action</th></tr></thead>
                <tbody>
                  {currentTypeVouchers.length === 0 && <tr><td colSpan="6" className="text-center">No vouchers found.</td></tr>}
                  {currentTypeVouchers.map((voucher) => (
                    <tr key={`${voucher.voucher_type}-${voucher.id}`}>
                      <td>{voucher.voucher_no}</td>
                      <td>{voucher.voucher_date}</td>
                      <td>{voucher.narration}</td>
                      <td>{money(voucher.dr)}</td>
                      <td>{money(voucher.cr)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0 mr-2"
                          disabled={busy}
                          onClick={() => editVoucher(voucher)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm !bg-gradient-to-br from-[#D60000] to-[#B70000] !text-white border-0 mr-1"
                          disabled={busy}
                          onClick={() => deleteVoucher(voucher)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section === "ledger" && (
            <>
              <div className="card card-body mb-3">
                <label htmlFor="ledger_account">Select Account</label>
                <select
                  id="ledger_account"
                  className="form-control"
                  value={selectedLedgerAccount}
                  onChange={(event) => loadLedger(event.target.value)}
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map((account) => (
                    <option value={account.id} key={account.id}>{accountCodeLabel(account.account_code)} — {account.account_name}</option>
                  ))}
                </select>
              </div>
              {selectedLedgerAccount && (
                <>
                  <p><strong>Opening balance:</strong> {money(ledger.opening_balance)} &nbsp; <strong>Closing balance:</strong> {money(ledger.closing_balance)}</p>
                  <div className="table-responsive">
                    <table className="table table-striped custom-table">
                      <thead><tr><th>Date</th><th>Voucher Type</th><th>Particulars</th><th>Debit (Dr)</th><th>Credit (Cr)</th><th>Balance</th></tr></thead>
                      <tbody>
                        {!busy && ledger.rows.length === 0 && <tr><td colSpan="6" className="text-center">No posted entries found for this account.</td></tr>}
                        {ledger.rows.map((row) => (
                          <tr key={`${row.voucher_type}-${row.detail_id}`}>
                            <td>{row.voucher_date}</td><td className="text-capitalize">{row.voucher_type}</td><td>{row.remarks || row.voucher_no}</td>
                            <td>{money(row.dr)}</td><td>{money(row.cr)}</td><td><strong>{money(row.running_balance)}</strong></td>
                          </tr>
                        ))}
                        {busy && <tr><td colSpan="6" className="text-center">Loading ledger...</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}

          {section === "profit-loss" && (
            <>
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
                    {profitLoss.rows.length === 0 && <tr><td colSpan="4" className="text-center">No income or expense records found.</td></tr>}
                    {profitLoss.rows.map((row) => (
                      <tr key={row.id}><td>{accountCodeLabel(row.account_code)}</td><td>{row.account_name}</td><td>{row.account_type}</td><td>{money(row.net_amount)}</td></tr>
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
