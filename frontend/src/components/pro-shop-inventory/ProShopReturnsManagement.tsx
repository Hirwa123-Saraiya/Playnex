import React from 'react';
import { 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Package, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';
import { ReturnStatus } from '../../types/ProShopInventoryTypes';

export const ProShopReturnsManagement: React.FC = () => {
  const { returns, updateReturnStatus, products, updateProduct, addTransaction, setToastMessage } = useProShopStore();

  const handleApprove = (id: string, prodId: string, qty: number, prodName: string) => {
    updateReturnStatus(id, 'Approved');
  };

  const handleRefund = (id: string, prodId: string, qty: number, prodName: string, refundAmt: number) => {
    updateReturnStatus(id, 'Refunded');
    
    // Automatically restock central inventory
    const targetProduct = products.find(p => p.id === prodId);
    if (targetProduct) {
      updateProduct(prodId, { availableStock: targetProduct.availableStock + qty });
      addTransaction({
        productId: prodId,
        productName: prodName,
        sku: targetProduct.sku,
        type: 'Product Returns',
        quantity: +qty,
        performedBy: 'Customer Service Lead',
        remarks: `Inventory Restocked after Verified Return #${id}`
      });
    }

    setToastMessage(`Refund of ₹${refundAmt.toLocaleString('en-IN')} released to member's original payment mode.`);
  };

  const handleReject = (id: string) => {
    updateReturnStatus(id, 'Rejected');
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
          9
        </span>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Returns & Refunds</h2>
          <p className="text-xs text-slate-500 font-medium">Verify member merchandise returns, replenish stock and disburse refunds</p>
        </div>
      </div>

      {/* 4-Step Visual Workflow matching Reference Image Card 9 */}
      <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {/* Step 1 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Return Request</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Member initiates</span>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Verify Product</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Tags & condition check</span>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Update Inventory</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Central stock +1</span>
          </div>

          {/* Step 4 */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900">Refund Payment</span>
            <span className="text-[10px] text-purple-600 font-bold mt-0.5">Wallet / Bank transfer</span>
          </div>
        </div>
      </div>

      {/* Returns Registry Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Return ID</th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Member</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Refund Amount</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {returns.map((r) => {
                const statusBadge = 
                  r.status === 'Refunded' ? 'bg-purple-100 text-purple-700' :
                  r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                  r.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700';

                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{r.returnId}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      <div>{r.productName}</div>
                      <span className="text-[10px] text-slate-400 font-mono font-normal">SKU: {r.productSku}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">{r.memberName}</td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-800">{r.quantity}</td>
                    <td className="py-3.5 px-3 text-right font-black text-slate-900">
                      ₹{r.refundAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {r.reason}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {r.status === 'Pending' && (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleApprove(r.id, r.productId, r.quantity, r.productName)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(r.id)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {r.status === 'Approved' && (
                        <button
                          onClick={() => handleRefund(r.id, r.productId, r.quantity, r.productName, r.refundAmount)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition"
                        >
                          Process Refund
                        </button>
                      )}

                      {r.status === 'Refunded' && (
                        <span className="text-[11px] text-purple-600 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}

                      {r.status === 'Rejected' && (
                        <span className="text-[11px] text-rose-600 font-medium">
                          Declined
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
    </div>
  );
};
