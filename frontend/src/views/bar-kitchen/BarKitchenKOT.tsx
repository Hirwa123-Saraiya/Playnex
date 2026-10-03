import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Printer,
  CheckCircle2,
  Filter,
  Plus,
  Search,
  Sparkles,
  ChefHat,
  Volume2,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenKOTCard } from '../../components/bar-kitchen/BarKitchenKOTCard';
import { BarKitchenKOT as KOTType, KOTStatus } from '../../types/BarKitchenTypes';

export const BarKitchenKOT: React.FC = () => {
  const { kots, updateKOTStatus } = useBarKitchenStore();
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');
  const [selectedStation, setSelectedStation] = useState<string>('All');
  const [printKotModal, setPrintKotModal] = useState<KOTType | null>(null);

  const activeKOTs = kots.filter((k) =>
    activeTab === 'Active' ? k.status !== 'Served' : k.status === 'Served'
  );

  const filteredKOTs = activeKOTs.filter((k) => {
    if (selectedStation === 'All') return true;
    return k.station === selectedStation;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
              Live Kitchen Pipeline
            </span>
            <span className="text-xs text-slate-400">• {activeKOTs.length} Orders Active</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Kitchen Order Ticket (KOT) Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated KOT printing, station routing, preparation time monitors and steward handoff.
          </p>
        </div>

        {/* Tab switcher matching Reference Image: Active Orders | Completed */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('Active')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'Active'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Orders ({kots.filter((k) => k.status !== 'Served').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Completed')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'Completed'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Station Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          'All',
          'Grill Station',
          'Pizza Station',
          'Beverage Station',
          'Snacks Station',
          'Main Course Station',
          'Dessert Station',
          'Bar Station',
        ].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStation(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedStation === st
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* KOT Cards Grid matching Reference Image Panel 4:
          #101 Table T2 | #102 Table T5 | #103 Table T6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredKOTs.map((kot) => (
          <BarKitchenKOTCard
            key={kot.id}
            kot={kot}
            onStatusChange={updateKOTStatus}
            onPrint={(k) => setPrintKotModal(k)}
          />
        ))}

        {filteredKOTs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
            <ChefHat className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">No Orders in this View</h4>
            <p className="text-xs text-slate-400 mt-1">
              All tickets have been fulfilled or dispatched to floor stewards.
            </p>
          </div>
        )}
      </div>

      {/* Thermal KOT Print Preview Modal */}
      {printKotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 font-mono text-xs">
            <div className="text-center pb-2 border-b-2 border-dashed border-slate-300 space-y-1">
              <h3 className="font-black text-sm uppercase">PLAYNEX SPORTS CLUB</h3>
              <p className="text-[10px] text-slate-500">KITCHEN ORDER TICKET (KOT)</p>
              <div className="text-xs font-extrabold text-slate-900">
                KOT: {printKotModal.kotNumber} • Table: {printKotModal.tableNumber}
              </div>
              <p className="text-[10px] text-slate-400">
                Steward: {printKotModal.stewardName} • {printKotModal.createdAt}
              </p>
            </div>

            <div className="space-y-2 py-2 border-b-2 border-dashed border-slate-300">
              {printKotModal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between font-bold text-xs">
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  {item.notes && <span className="text-[10px] italic">({item.notes})</span>}
                </div>
              ))}
            </div>

            <div className="text-center pt-1 text-[10px] text-slate-500">
              *** STATION: {printKotModal.station.toUpperCase()} ***
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPrintKotModal(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl font-bold font-sans text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Sent to Thermal Kitchen Printer: ${printKotModal.kotNumber}`);
                  setPrintKotModal(null);
                }}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-bold font-sans flex items-center gap-1 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
