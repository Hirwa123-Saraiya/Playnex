import React, { useState } from 'react';
import {
  Settings,
  Printer,
  Volume2,
  Percent,
  ChefHat,
  Building2,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';

export const BarKitchenSettings: React.FC = () => {
  const { currentFacility } = useBarKitchenStore();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    outletName: currentFacility.name,
    gstPercent: 5,
    serviceChargePercent: 5,
    alcoholVatPercent: 20,
    kotSoundAlerts: true,
    autoPrintKOTOnSend: true,
    kitchenCutoffTime: '11:00 PM',
    thermalPrinterIP: '192.168.1.185',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bar & Kitchen Hardware & Terminal Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure thermal receipt printers, KOT routing stations, tax slabs, sound alarms, and operational shifts.
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Configuration Updated
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taxes & Charges */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Percent className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-black text-slate-900">Tax Slabs & Service Fees</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Food GST Rate (%)</label>
              <input
                type="number"
                value={settings.gstPercent}
                onChange={(e) => setSettings({ ...settings, gstPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Discretionary Service Charge (%)</label>
              <input
                type="number"
                value={settings.serviceChargePercent}
                onChange={(e) => setSettings({ ...settings, serviceChargePercent: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">State Liquor Excise VAT (%)</label>
              <input
                type="number"
                value={settings.alcoholVatPercent}
                onChange={(e) => setSettings({ ...settings, alcoholVatPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Hardware & Printer Dispatch */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Printer className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-black text-slate-900">Thermal Kitchen Printers & KDS Audio</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kitchen KOT ESC/POS Network IP</label>
              <input
                type="text"
                value={settings.thermalPrinterIP}
                onChange={(e) => setSettings({ ...settings, thermalPrinterIP: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={settings.autoPrintKOTOnSend}
                  onChange={(e) => setSettings({ ...settings, autoPrintKOTOnSend: e.target.checked })}
                  className="rounded"
                />
                <span>Automatically print thermal KOT slip on "Send to Kitchen"</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={settings.kotSoundAlerts}
                  onChange={(e) => setSettings({ ...settings, kotSoundAlerts: e.target.checked })}
                  className="rounded"
                />
                <span>Audible buzzer chime on incoming KDS ticket</span>
              </label>
            </div>
          </div>
        </div>

        <div className="col-span-full flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Terminal Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
