import { useState } from 'react';

function InvoiceItems({ type, medicines, items, setItems }) {
    const isSale = type === 'sale';
    const priceField = isSale ? 'selling_price' : 'purchase_price';
    const priceLabel = isSale ? 'Unit sale price' : 'Unit purchase price';
    const [draft, setDraft] = useState({ medicine_id: '', quantity: '1', unit_price: '' });

    const total = items.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
        0
    );

    function selectMedicine(event) {
        const medicine = medicines.find(item => String(item.id) === event.target.value);
        setDraft({
            medicine_id: event.target.value,
            quantity: '1',
            unit_price: medicine ? String(medicine[priceField] ?? '') : '',
        });
    }

    function addItem() {
        const medicine = medicines.find(item => String(item.id) === draft.medicine_id);
        const quantity = Number(draft.quantity);
        const price = Number(draft.unit_price);

        if (!medicine || !Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) {
            alert('Select a medicine and enter a valid quantity and price');
            return;
        }
        if (items.some(item => item.medicine_id === draft.medicine_id)) {
            alert('This medicine is already in the invoice. Change its quantity in the invoice list.');
            return;
        }

        setItems(current => [...current, {
            row_id: `${medicine.id}-${Date.now()}`,
            medicine_id: String(medicine.id),
            medicine_name: medicine.medicine_name,
            stock_qty: medicine.stock_qty ?? '',
            quantity: String(quantity),
            unit_price: price.toFixed(2),
        }]);
        setDraft({ medicine_id: '', quantity: '1', unit_price: '' });
    }

    function updateItem(rowId, field, value) {
        setItems(current => current.map(item =>
            item.row_id === rowId ? { ...item, [field]: value } : item
        ));
    }

    function removeItem(rowId) {
        setItems(current => current.filter(item => item.row_id !== rowId));
    }

    return (
        <>
            <h5 className="mt-3">Add medicines to this {isSale ? 'sale' : 'purchase'}</h5>
            <div className="row align-items-end">
                <div className="form-group col-md-5">
                    <label htmlFor="invoice_medicine">Medicine</label>
                    <select id="invoice_medicine" className="form-control" value={draft.medicine_id} onChange={selectMedicine}>
                        <option value="">Select medicine</option>
                        {medicines.map(item => <option key={item.id} value={item.id}>{item.medicine_name} (stock: {item.stock_qty})</option>)}
                    </select>
                </div>
                <div className="form-group col-md-2">
                    <label htmlFor="invoice_quantity">Quantity</label>
                    <input id="invoice_quantity" type="number" min="1" step="1" className="form-control" value={draft.quantity}
                        onChange={event => setDraft({ ...draft, quantity: event.target.value })} />
                </div>
                <div className="form-group col-md-3">
                    <label htmlFor="invoice_unit_price">{priceLabel}</label>
                    <input id="invoice_unit_price" type="number" min="0" step="0.01" className="form-control" value={draft.unit_price}
                        onChange={event => setDraft({ ...draft, unit_price: event.target.value })} />
                </div>
                <div className="form-group col-md-2">
                    <button type="button" className="btn btn-secondary mb-3" onClick={addItem}>Add item</button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead><tr><th>Medicine</th><th>In stock</th><th>Quantity</th><th>{priceLabel}</th><th>Line total</th><th></th></tr></thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.row_id}>
                                <td>{item.medicine_name}</td>
                                <td>{item.stock_qty}</td>
                                <td>
                                    <input aria-label={`Quantity for ${item.medicine_name}`} type="number" min="1" step="1" className="form-control" value={item.quantity} required
                                        onChange={event => updateItem(item.row_id, 'quantity', event.target.value)} />
                                </td>
                                <td>
                                    <input aria-label={`Unit price for ${item.medicine_name}`} type="number" min="0" step="0.01" className="form-control" value={item.unit_price} required
                                        onChange={event => updateItem(item.row_id, 'unit_price', event.target.value)} />
                                </td>
                                <td>{(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}</td>
                                <td><button type="button" className="btn btn-sm btn-danger"
                                    onClick={() => removeItem(item.row_id)}>Remove</button></td>
                            </tr>
                        ))}
                        {!items.length && <tr><td colSpan="6" className="text-center">No medicines added to this invoice</td></tr>}
                    </tbody>
                    <tfoot><tr><th colSpan="4" className="text-right">Invoice total</th><th>{total.toFixed(2)}</th><th></th></tr></tfoot>
                </table>
            </div>
        </>
    );
}

export default InvoiceItems;
