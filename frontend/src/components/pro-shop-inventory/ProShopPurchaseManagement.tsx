import React, { useState } from 'react';
import { 
  Truck, 
  FileText, 
  PackageCheck, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  Layers,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';
import { PurchaseOrderStatus, ProShopPurchaseOrder } from '../../types/ProShopInventoryTypes';

export const ProShopPurchaseManagement: React.FC = () => {
  const { vendors, purchaseOrders, addPurchaseOrder, updatePurchaseOrderStatus, products } = useProShopStore();
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0].id);
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [poQuantity, setPoQuantity] = useState(50);
  const [deliveryDate, setDeliveryDate] = useState('2025-10-15');
  const [poNotes, setPoNotes] = useState('');

  const selectedProd = products.find(p => p.id === selectedProductId) || products[0];
  const selectedVend = vendors.find(v => v.id === selectedVendorId) || vendors[0];

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const unitCost = selectedProd.costPrice;
    const totalCost = unitCost * poQuantity;

    addPurchaseOrder({
      vendorId: selectedVend.id,
      vendorName: selectedVend.name,
      items: [
        {
          productId: selectedProd.id,
          productName: selectedProd.name,
          quantity: poQuantity,
          unitCost,
          totalCost
        }
      ],
      totalAmount: totalCost,
      status: 'Submitted',
      createdDate: 'Today',
      expectedDeliveryDate: deliveryDate,
      notes: poNotes
    });

    setShowPOModal(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            8
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Purchase Management</h2>
            <p className="text-xs text-slate-500 font-medium">Reorder stock, track vendor fulfillment and update central inventory automatically</p>
          </div>
        </div>

        <button
          onClick={() => setShowPOModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Create Purchase Order
        </button>
      </div>

      {/* 4-Step Visual Workflow matching Reference Image Card 8 */}
      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {/* Step 1 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Create Purchase Order</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Define SKUs & caps</span>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Vendor Supply</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Supplier dispatches</span>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
              <PackageCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Receive Stock</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Inspection & GRN</span>
          </div>

          {/* Step 4 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Stock Updated</span>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5">+ Live on POS & App</span>
          </div>
        </div>
      </div>

      {/* Grid: Purchase Orders Register & Authorized Vendors Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PO Table */}
        <div className="lg:col-span-8 border border-slate-200 rounded-2xl overflow-hidden bg-white">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Purchase Orders Registry</span>
            <span className="text-[11px] text-slate-500">{purchaseOrders.length} active orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">PO Number</th>
                  <th className="py-2.5 px-3">Vendor</th>
                  <th className="py-2.5 px-3">Items & Qty</th>
                  <th className="py-2.5 px-3 text-right">Total Cost</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((po) => {
                  const statusColor = 
                    po.status === 'Received' ? 'bg-emerald-100 text-emerald-700' :
                    po.status === 'Ordered' ? 'bg-blue-100 text-blue-700' :
                    po.status === 'Submitted' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-200 text-slate-700';

                  return (
                    <tr key={po.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{po.poNumber}</td>
                      <td className="py-3 px-3 text-slate-800 font-medium">{po.vendorName}</td>
                      <td className="py-3 px-3 text-slate-600">
                        {po.items.map(i => `${i.productName} (${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">
                        ₹{po.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {po.status !== 'Received' ? (
                          <button
                            onClick={() => updatePurchaseOrderStatus(po.id, 'Received')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition"
                          >
                            Receive & Stock In
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Restocked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vendors Directory */}
        <div className="lg:col-span-4 border border-slate-200 rounded-2xl overflow-hidden bg-white">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
            Authorized Sports Vendors ({vendors.length})
          </div>
          <div className="p-3 space-y-3 max-h-[300px] overflow-y-auto text-xs">
            {vendors.map((v) => (
              <div key={v.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">{v.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    {v.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">Contact: {v.contactPerson}</div>
                <div className="flex items-center gap-3 text-[11px] text-slate-600 font-mono">
                  <span>{v.phone}</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {v.productsSupplied.map((cat, idx) => (
                    <span key={idx} className="px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create PO Modal */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Create Supplier Purchase Order</h3>
            <form onSubmit={handleCreatePO} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Select Vendor</label>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Select Product to Restock</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.availableStock} in stock)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Order Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={poQuantity}
                    onChange={(e) => setPoQuantity(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Expected Delivery</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-500">Calculated PO Landed Value:</span>
                <span className="text-base font-black text-slate-900">
                  ₹{(selectedProd.costPrice * poQuantity).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
                >
                  Submit Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
