import { useState } from "react";
import api from "../../LIb/axios.js";

const accountTypes = ["Asset", "Liability", "Equity", "Income", "Expense", "VAT"];
const today = () => new Date().toISOString().slice(0, 10);
const blankLine = () => ({ account_head_id: "", dr: "", cr: "", remarks: "" });

function AccountsCreate({ section, accounts, onSaved, onError, onNotice }) {
  const [busy, setBusy] = useState(false);
  const [lines, setLines] = useState([blankLine(), blankLine()]);
  const childAccountIds = new Set(
    accounts.filter((account) => account.parent_id).map((account) => String(account.parent_id)),
  );
  const leafAccounts = accounts.filter(
    (account) => account.status === "Active" && !childAccountIds.has(String(account.id)),
  );

  const request = async (url, config) => {
    const response = await api(url, config);
    if (!response.data?.status) {
      throw new Error(response.data?.message || "Request failed");
    }
    return response.data.data;
  };

  const submitAccount = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    onError("");
    onNotice("");
    try {
      await request("accounts/create.php?type=account", {
        method: "POST",
        data: new FormData(formElement),
      });
      formElement.reset();
      onNotice("Account head created.");
      onSaved();
    } catch (error) {
      onError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const updateLine = (index, field, value) => {
    setLines((current) => current.map((line, lineIndex) => (
      lineIndex === index ? { ...line, [field]: value } : line
    )));
  };

  const submitVoucher = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    onError("");
    onNotice("");
    try {
      const form = new FormData(formElement);
      form.set("voucher_type", section);
      form.set("lines", JSON.stringify(lines));
      const result = await request("accounts/create.php?type=voucher", {
        method: "POST",
        data: form,
      });
      setLines([blankLine(), blankLine()]);
      formElement.reset();
      onNotice(`Draft ${result.voucher_no} created. Post it from the voucher list when ready.`);
      onSaved();
    } catch (error) {
      onError(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (section === "heads") {
    return (
      <div className="card mb-4">
        <div className="card-header"><h5 className="mb-0">Add Account Head</h5></div>
        <div className="card-body">
          <form onSubmit={submitAccount}>
            <div className="row">
              <div className="form-group col-md-3">
                <label htmlFor="account_code">Account code</label>
                <input className="form-control" id="account_code" name="account_code" maxLength="100" required />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="account_name">Account name</label>
                <input className="form-control" id="account_name" name="account_name" maxLength="150" required />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="account_type">Account type</label>
                <select className="form-control" id="account_type" name="account_type" required defaultValue="">
                  <option value="" disabled>Select type</option>
                  {accountTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="account_subtype">Subtype (optional)</label>
                <input className="form-control" id="account_subtype" name="account_subtype" maxLength="100" />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="parent_id">Parent account (optional)</label>
                <select className="form-control" id="parent_id" name="parent_id" defaultValue="">
                  <option value="">No parent</option>
                  {accounts.filter((account) => account.status === "Active").map((account) => (
                    <option value={account.id} key={account.id}>
                      {account.account_code} — {account.account_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="opening_balance">Opening balance</label>
                <input className="form-control" id="opening_balance" name="opening_balance" type="number" min="0" step="0.01" defaultValue="0.00" required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="description">Description</label>
                <input className="form-control" id="description" name="description" maxLength="2000" />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save Account"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Create {section === "journal" ? "Journal Voucher" : section === "receive" ? "Receive Voucher" : "Payment Voucher"}</h5>
        <small>Voucher lines must have equal debit and credit totals. New vouchers are saved as drafts.</small>
      </div>
      <div className="card-body">
        <form onSubmit={submitVoucher}>
          <div className="row">
            {section !== "journal" && (
              <div className="form-group col-md-4">
                <label htmlFor="party_name">{section === "receive" ? "Received from" : "Pay to"}</label>
                <input className="form-control" id="party_name" name="party_name" maxLength="150" required />
              </div>
            )}
            <div className="form-group col-md-4">
              <label htmlFor="voucher_date">Voucher date</label>
              <input className="form-control" id="voucher_date" name="voucher_date" type="date" defaultValue={today()} required />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="narration">Narration</label>
              <input className="form-control" id="narration" name="narration" maxLength="2000" />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead><tr><th>Account</th><th>Debit</th><th>Credit</th><th>Remarks</th><th></th></tr></thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index}>
                    <td>
                      <select className="form-control" value={line.account_head_id} onChange={(event) => updateLine(index, "account_head_id", event.target.value)} required>
                        <option value="">Select detail account</option>
                        {leafAccounts.map((account) => (
                          <option key={account.id} value={account.id}>{account.account_code} — {account.account_name}</option>
                        ))}
                      </select>
                    </td>
                    <td><input className="form-control" type="number" min="0" step="0.01" value={line.dr} onChange={(event) => updateLine(index, "dr", event.target.value)} placeholder="0.00" /></td>
                    <td><input className="form-control" type="number" min="0" step="0.01" value={line.cr} onChange={(event) => updateLine(index, "cr", event.target.value)} placeholder="0.00" /></td>
                    <td><input className="form-control" maxLength="255" value={line.remarks} onChange={(event) => updateLine(index, "remarks", event.target.value)} /></td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-danger" disabled={lines.length <= 2} onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-outline-primary mr-2" onClick={() => setLines((current) => [...current, blankLine()])} disabled={lines.length >= 100}>
            Add line
          </button>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Saving..." : "Save Draft"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountsCreate;
