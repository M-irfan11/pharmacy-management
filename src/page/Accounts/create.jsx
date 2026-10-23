import { useEffect, useState } from "react";
import api from "../../LIb/axios.js";
import { accountCodeLabel } from "../../accountCodeLabel.js";

const accountTypes = ["Asset", "Liability", "Equity", "Income", "Expense", "VAT"];
const today = () => new Date().toISOString().slice(0, 10);
const blankLine = () => ({ account_head_id: "", dr: "", cr: "", remarks: "" });

function AccountsCreate({ section, accounts, account, voucher, onSaved, onError, onNotice, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [nextAccountCode, setNextAccountCode] = useState("101");
  const [lines, setLines] = useState(() => (
    voucher?.details?.length
      ? voucher.details.map((line) => ({
        account_head_id: String(line.account_head_id),
        dr: String(line.dr),
        cr: String(line.cr),
        remarks: line.remarks || "",
      }))
      : [blankLine(), blankLine()]
  ));
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

  useEffect(() => {
    if (section !== "heads") {
      return undefined;
    }
    let active = true;
    api("accounts/index.php?view=next_account_code")
      .then((response) => {
        if (!response.data?.status) {
          throw new Error(response.data?.message || "Could not load the next account code.");
        }
        if (active) {
          setNextAccountCode(response.data.data.account_code);
        }
      })
      .catch((error) => {
        if (active) {
          onError(error.message);
        }
      });
    return () => {
      active = false;
    };
  }, [section, accounts, onError]);

  const submitAccount = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    onError("");
    onNotice("");
    try {
      const form = new FormData(formElement);
      if (account) {
        form.set("action", "update_account");
        form.set("id", account.id);
      }
      const result = await request(
        account ? "accounts/update.php" : "accounts/create.php?type=account",
        {
        method: "POST",
          data: form,
        },
      );
      formElement.reset();
      onNotice(account ? "Account head updated." : `Account head created with code ${result.account_code}.`);
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
      form.set("lines", JSON.stringify(lines.map((line) => ({
        ...line,
        dr: line.dr.trim() === "" ? "0" : line.dr,
        cr: line.cr.trim() === "" ? "0" : line.cr,
      }))));
      if (voucher) {
        form.set("id", voucher.id);
        form.set("action", "edit_voucher");
      }
      const result = await request(
        voucher ? "accounts/update.php" : "accounts/create.php?type=voucher",
        {
          method: "POST",
          data: form,
        },
      );
      setLines([blankLine(), blankLine()]);
      formElement.reset();
      onNotice(voucher ? `Voucher ${result.voucher_no} updated.` : `Voucher ${result.voucher_no} saved.`);
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
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{account ? "Edit Account Head" : "Add Account Head"}</h5>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>Back to list</button>
        </div>
        <div className="card-body">
          <form onSubmit={submitAccount}>
            <div className="row">
              <div className="form-group col-md-3">
                <label htmlFor="account_code">Account code</label>
                <div className="form-control bg-light" id="account_code" aria-live="polite">{account?.account_code || nextAccountCode}</div>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="account_name">Account name</label>
                <input className="form-control" id="account_name" name="account_name" maxLength="150" defaultValue={account?.account_name || ""} required />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="account_type">Account type</label>
                <select className="form-control" id="account_type" name="account_type" required defaultValue={account?.account_type || ""}>
                  <option value="" disabled>Select type</option>
                  {accountTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="account_subtype">Subtype (optional)</label>
                <input className="form-control" id="account_subtype" name="account_subtype" maxLength="100" defaultValue={account?.account_subtype || ""} />
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="parent_id">Parent account (optional)</label>
                <select className="form-control" id="parent_id" name="parent_id" defaultValue={account?.parent_id || ""}>
                  <option value="">No parent</option>
                  {accounts.filter((candidate) => candidate.status === "Active" && Number(candidate.id) !== Number(account?.id)).map((candidate) => (
                    <option value={candidate.id} key={candidate.id}>
                      {accountCodeLabel(candidate.account_code)} — {candidate.account_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="opening_balance">Opening balance</label>
                <input className="form-control" id="opening_balance" name="opening_balance" type="number" min="0" step="0.01" defaultValue={account?.opening_balance || "0.00"} required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="description">Description</label>
                <input className="form-control" id="description" name="description" maxLength="2000" defaultValue={account?.description || ""} />
              </div>
            </div>
            <button className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0" type="submit" disabled={busy}>
              {busy ? "Saving..." : account ? "Update Account" : "Save Account"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{voucher ? "Edit" : "Create"} {section === "journal" ? "Journal Voucher" : section === "receive" ? "Receive Voucher" : "Payment Voucher"}</h5>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>Back to list</button>
        </div>
        <small>Voucher lines must have equal debit and credit totals.</small>
      </div>
      <div className="card-body">
        <form onSubmit={submitVoucher}>
          <div className="row">
            {section !== "journal" && (
              <div className="form-group col-md-4">
                <label htmlFor="party_name">{section === "receive" ? "Received from" : "Pay to"}</label>
                <input className="form-control" id="party_name" name="party_name" maxLength="150" defaultValue={voucher?.received_from || voucher?.pay_to || ""} required />
              </div>
            )}
            <div className="form-group col-md-4">
              <label htmlFor="voucher_date">Voucher date</label>
              <input className="form-control" id="voucher_date" name="voucher_date" type="date" defaultValue={voucher?.voucher_date || today()} required />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="narration">Narration</label>
              <input className="form-control" id="narration" name="narration" maxLength="2000" defaultValue={voucher?.narration || ""} />
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
                          <option key={account.id} value={account.id}>{accountCodeLabel(account.account_code)} — {account.account_name}</option>
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
          <button type="button" className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0 mr-2" onClick={() => setLines((current) => [...current, blankLine()])} disabled={lines.length >= 100}>
            Add line
          </button>
          <button className="btn !bg-gradient-to-br from-[#0d6efd] to-[#6610f2] !text-white border-0" type="submit" disabled={busy}>
            {busy ? "Saving..." : voucher ? "Update Voucher" : "Save Voucher"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountsCreate;
