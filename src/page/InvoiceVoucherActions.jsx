import { useState } from "react";
import { createPortal } from "react-dom";
import api from "../LIb/axios.js";
import { accountCodeLabel } from "../accountCodeLabel.js";

const money = (value) => Number(value || 0).toFixed(2);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[character]));

function voucherPrintContent(voucher) {
  const rows = (voucher.details || []).map((line) => `
    <tr>
      <td>${escapeHtml(accountCodeLabel(line.account_code))} — ${escapeHtml(line.account_name)}</td>
      <td>${escapeHtml(line.remarks)}</td>
      <td class="amount">${money(line.dr)}</td>
      <td class="amount">${money(line.cr)}</td>
    </tr>`).join("");
  return `
    <h1>${voucher.voucher_type === "receive" ? "Receive Voucher" : "Payment Voucher"}</h1>
    <p class="meta"><strong>Voucher No:</strong> ${escapeHtml(voucher.voucher_no)}</p>
    <p class="meta"><strong>Date:</strong> ${escapeHtml(voucher.voucher_date)}</p>
    <p class="meta"><strong>${voucher.voucher_type === "receive" ? "Received from" : "Paid to"}:</strong> ${escapeHtml(voucher.party_name)}</p>
    <p class="meta"><strong>Narration:</strong> ${escapeHtml(voucher.narration)}</p>
    <table><thead><tr><th>Account</th><th>Remarks</th><th class="amount">Debit</th><th class="amount">Credit</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <p class="total">Total: ${money(voucher.dr)}</p>
    <div class="signatures"><span>Prepared by</span><span>Received / Paid by</span><span>Authorized by</span></div>`;
}

function InvoiceVoucherActions({ type, invoice, onVoucherCreated }) {
  const [accounts, setAccounts] = useState([]);
  const [selection, setSelection] = useState({ cash: "", category: "" });
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const accountCandidates = () => {
    const childIds = new Set(
      accounts.filter((account) => account.parent_id).map((account) => String(account.parent_id)),
    );
    const leaves = accounts.filter(
      (account) => account.status === "Active" && !childIds.has(String(account.id)),
    );
    const cashAccounts = leaves.filter(
      (account) => account.account_type === "Asset"
        && /cash|bank/i.test(`${account.account_name} ${account.account_subtype || ""}`),
    );
    const categoryType = type === "sale" ? "Income" : "Expense";
    return {
      leaves,
      cashAccounts,
      categoryAccounts: leaves.filter((account) => account.account_type === categoryType),
    };
  };

  const createVoucher = async (cashAccountId = "", categoryAccountId = "") => {
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set("source_type", type);
      form.set("source_id", invoice.id);
      if (cashAccountId) form.set("cash_account_id", cashAccountId);
      if (categoryAccountId) form.set("category_account_id", categoryAccountId);
      const response = await api("accounts/create.php?type=invoice_voucher", { method: "POST", data: form });
      if (!response.data?.status) {
        throw new Error(response.data?.message || "Could not create voucher.");
      }
      setShowAccountPicker(false);
      onVoucherCreated(invoice.id, response.data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const prepareVoucher = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await api.get("accounts/index.php?view=accounts");
      if (!response.data?.status) {
        throw new Error(response.data?.message || "Could not load account heads.");
      }
      setAccounts(response.data.data);
      const childIds = new Set(
        response.data.data.filter((account) => account.parent_id).map((account) => String(account.parent_id)),
      );
      const leaves = response.data.data.filter(
        (account) => account.status === "Active" && !childIds.has(String(account.id)),
      );
      const cashAccounts = leaves.filter(
        (account) => account.account_type === "Asset"
          && /cash|bank/i.test(`${account.account_name} ${account.account_subtype || ""}`),
      );
      const categoryType = type === "sale" ? "Income" : "Expense";
      const categoryAccounts = leaves.filter((account) => account.account_type === categoryType);
      if (cashAccounts.length === 1 && categoryAccounts.length <= 1) {
        await createVoucher(cashAccounts[0].id, categoryAccounts[0]?.id || "");
      } else {
        setSelection({
          cash: cashAccounts.length === 1 ? String(cashAccounts[0].id) : "",
          category: categoryAccounts.length === 1 ? String(categoryAccounts[0].id) : "",
        });
        setShowAccountPicker(true);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const printVoucher = async () => {
    setError("");
    const printWindow = window.open("", "_blank", "width=850,height=700");
    if (!printWindow) {
      setError("Allow pop-ups to print this voucher.");
      return;
    }
    try {
      const response = await api.get(
        `accounts/index.php?view=source_voucher&type=${type}&id=${invoice.id}`,
      );
      if (!response.data?.status) {
        throw new Error(response.data?.message || "Could not load voucher.");
      }
      const voucher = response.data.data;
      printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(voucher.voucher_no)}</title>
        <style>body{font:14px Arial,sans-serif;color:#222;margin:32px}h1{font-size:22px;margin-bottom:8px}.meta{margin:5px 0}table{width:100%;border-collapse:collapse;margin-top:22px}th,td{border:1px solid #bbb;padding:8px;text-align:left}th{background:#f2f2f2}.amount{text-align:right}.total{font-weight:bold;text-align:right;margin-top:16px}.signatures{display:flex;justify-content:space-between;margin-top:70px}.signatures span{border-top:1px solid #555;padding:8px 24px}@media print{body{margin:16mm}}</style>
        </head><body>${voucherPrintContent(voucher)}</body></html>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (printError) {
      printWindow.close();
      setError(printError.response?.data?.message || printError.message);
    }
  };

  const candidates = accountCandidates();
  const cashOptions = candidates.leaves.filter((account) => account.account_type === "Asset");
  const categoryType = type === "sale" ? "Income" : "Expense";

  return (
    <>
      {invoice.account_voucher ? (
        <button
          type="button"
          className="btn btn-sm btn-outline-primary mr-1"
          title={`Print ${invoice.account_voucher.voucher_no}`}
          aria-label={`Print ${type === "sale" ? "receive" : "payment"} voucher ${invoice.account_voucher.voucher_no}`}
          onClick={printVoucher}
        >
          <i className="fa fa-print"></i>
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-sm btn-outline-success mr-1"
          title={`Create ${type === "sale" ? "receive" : "payment"} voucher`}
          aria-label={`Create ${type === "sale" ? "receive" : "payment"} voucher`}
          disabled={busy}
          onClick={prepareVoucher}
        >
          <i className={`fa ${busy ? "fa-spinner fa-spin" : "fa-file-text-o"}`}></i>
        </button>
      )}
      {error && <div className="text-danger small mt-1">{error}</div>}
      {showAccountPicker && createPortal(
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-3" role="presentation">
          <form
            className="card w-full max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-voucher-title"
            onSubmit={(event) => {
              event.preventDefault();
              createVoucher(selection.cash, selection.category);
            }}
          >
            <div className="card-header">
              <h5 id="invoice-voucher-title" className="mb-0">
                Select accounts for {type === "sale" ? "Receive" : "Payment"} Voucher
              </h5>
            </div>
            <div className="card-body">
              <p>Invoice total: <strong>{money(invoice.total_amount)}</strong></p>
              <div className="form-group">
                <label htmlFor={`cash-account-${type}-${invoice.id}`}>Cash / Bank account (Asset)</label>
                {cashOptions.length === 0 && (
                  <small className="form-text text-danger">Create an active Asset account with “Cash” or “Bank” in its name first.</small>
                )}
                <select
                  id={`cash-account-${type}-${invoice.id}`}
                  className="form-control"
                  value={selection.cash}
                  onChange={(event) => setSelection((current) => ({ ...current, cash: event.target.value }))}
                  required
                >
                  <option value="">Select cash/bank account</option>
                  {cashOptions.map((account) => (
                    <option key={account.id} value={account.id}>{accountCodeLabel(account.account_code)} — {account.account_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor={`category-account-${type}-${invoice.id}`}>
                  {type === "sale" ? "Sales Income account" : "Purchase Expense account"}
                </label>
                {candidates.categoryAccounts.length === 0 ? (
                  <small className="form-text text-muted">
                    No active {categoryType.toLowerCase()} account exists; the system will create a default one.
                  </small>
                ) : (
                  <select
                    id={`category-account-${type}-${invoice.id}`}
                    className="form-control"
                    value={selection.category}
                    onChange={(event) => setSelection((current) => ({ ...current, category: event.target.value }))}
                    required
                  >
                    <option value="">Select {categoryType.toLowerCase()} account</option>
                    {candidates.categoryAccounts.map((account) => (
                      <option key={account.id} value={account.id}>{accountCodeLabel(account.account_code)} — {account.account_name}</option>
                    ))}
                  </select>
                )}
              </div>
              <small className="text-muted">This full-invoice voucher will be posted immediately.</small>
            </div>
            <div className="card-footer text-right">
              <button type="button" className="btn btn-outline-secondary mr-2" onClick={() => setShowAccountPicker(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={busy || cashOptions.length === 0}>
                {busy ? "Creating..." : "Create Voucher"}
              </button>
            </div>
          </form>
        </div>,
        document.body,
      )}
    </>
  );
}

export default InvoiceVoucherActions;
