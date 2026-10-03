import React from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { useProShopStore } from '../../store/ProShopInventoryStore';

export const ProShopLowStockAlerts: React.FC = () => {
  const { alerts, reorderAlertItem, setToastMessage } = useProShopStore();

  const primaryAlert = alerts[0]; // Tennis Balls (18 left, min 20)

  const handleNotifyVendor = (alertId: string, vendor: string) => {
    setToastMessage(`Automated PO dispatch email and SMS transmitted to ${vendor}`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
          4
        </span>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Low Stock Alerts</h2>
          <p className="text-xs text-slate-500 font-medium">Automatic multi-channel notifications triggered when stock falls below safety buffer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Featured Red Alert Box (Faithful to Reference Image 4) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-rose-50 via-red-50/40 to-pink-50/30 rounded-2xl p-6 border border-rose-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-600/30 animate-pulse">
                <Bell className="w-8 h-8" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700">
                  Critical Threshold Breached
                </span>
                <h3 className="text-xl font-black text-rose-900 mt-1">Low Stock Alert!</h3>
                <p className="text-sm font-semibold text-slate-800 mt-1.5 leading-snug">
                  Only <span className="text-rose-600 font-black text-base">{primaryAlert.currentStock}</span> {primaryAlert.productName} left in stock (Minimum: {primaryAlert.minimumStock})
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-rose-200/80 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>SKU: <strong className="font-mono text-slate-800">{primaryAlert.sku}</strong></span>
              <span>Supplier: <strong className="text-slate-800">{primaryAlert.vendorName}</strong></span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => reorderAlertItem(primaryAlert.id)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Please reorder.
            </button>
            <button
              onClick={() => handleNotifyVendor(primaryAlert.id, primaryAlert.vendorName)}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              Notify Vendor
            </button>
          </div>
        </div>

        {/* Right: Notification Channels & Alert Matrix */}
        <div className="lg:col-span-6 space-y-4">
          {/* Notification Channels matching Reference Image 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-3">
              Automated Notification Channels
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Mail className="w-4 h-4" /></div>
                <span className="text-xs font-bold text-slate-800">Email</span>
                <span className="text-[10px] text-emerald-600 font-medium">Delivered</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Smartphone className="w-4 h-4" /></div>
                <span className="text-xs font-bold text-slate-800">App Push</span>
                <span className="text-[10px] text-emerald-600 font-medium">Broadcasted</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><MessageSquare className="w-4 h-4" /></div>
                <span className="text-xs font-bold text-slate-800">SMS</span>
                <span className="text-[10px] text-slate-400 font-medium">(Optional)</span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600"><Bell className="w-4 h-4" /></div>
                <span className="text-xs font-bold text-slate-800">Dashboard</span>
                <span className="text-[10px] text-rose-600 font-bold">Active Banner</span>
              </div>
            </div>
          </div>

          {/* Secondary Alerts List */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
              Active Stock Warnings ({alerts.length})
            </div>
            <div className="divide-y divide-slate-100 max-h-[160px] overflow-y-auto text-xs">
              {alerts.slice(1).map((a) => (
                <div key={a.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                  <div>
                    <div className="font-bold text-slate-900">{a.productName}</div>
                    <div className="text-[11px] text-slate-500">
                      Current: <strong className="text-rose-600">{a.currentStock}</strong> | Min: <strong>{a.minimumStock}</strong> • {a.vendorName}
                    </div>
                  </div>
                  <button
                    onClick={() => reorderAlertItem(a.id)}
                    className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition"
                  >
                    Reorder →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
