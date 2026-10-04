import React, { useEffect, useState } from 'react';
import {
  Layers,
  Users,
  CheckCircle2,
  Clock,
  Receipt,
  UserCheck,
  ArrowRightLeft,
  Merge,
  Split,
  UtensilsCrossed,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenTableCard } from '../../components/bar-kitchen/BarKitchenTableCard';
import { TableArea, TableStatus } from '../../types/BarKitchenTypes';
import { mapRestaurantTable, restaurantService } from '../../services/restaurant.service';

export const BarKitchenTableManagement: React.FC = () => {
  const {
    tables,
    setTables,
    selectedTable,
    setSelectedTable,
    updateTableStatus,
    transferTable,
    setActiveNav,
    setTargetTableNumber,
  } = useBarKitchenStore();

  const [selectedArea, setSelectedArea] = useState<TableArea | 'All Areas'>('Indoor');
  const [transferTargetId, setTransferTargetId] = useState<string>('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    void restaurantService.getTables()
      .then((response) => {
        if (response.success && Array.isArray(response.data)) setTables(response.data.map(mapRestaurantTable));
      });
  }, [setTables]);

  const areas: (TableArea | 'All Areas')[] = [
    'All Areas',
    'Indoor',
    'Outdoor',
    'Poolside',
    'VIP',
    'Lounge',
    'Banquet',
  ];

  const filteredTables = tables.filter((t) => {
    if (selectedArea === 'All Areas') return true;
    return t.area === selectedArea;
  });

  const availableTables = tables.filter(
    (t) => t.status === 'Available' && t.id !== selectedTable?.id
  );

  const handleOpenPOSForTable = () => {
    if (!selectedTable) return;
    setTargetTableNumber(selectedTable.tableNumber);
    setActiveNav('Order Management');
  };

  const handleConfirmTransfer = () => {
    if (!selectedTable || !transferTargetId) return;
    transferTable(selectedTable.id, transferTargetId);
    setShowTransferModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Table Management & Floor Layout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Interactive visual floor map with real-time occupancy, guest turnover, and table merge/transfer.
          </p>
        </div>

        {/* Legend matching Reference Image Panel 2: Available (Green) • Occupied (Red) • Reserved (Yellow) */}
        <div className="flex flex-wrap items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xs text-xs font-bold">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            Available
          </span>
          <span className="flex items-center gap-1.5 text-rose-700">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Occupied
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            Reserved
          </span>
          <span className="flex items-center gap-1.5 text-sky-700">
            <span className="w-3 h-3 rounded-full bg-sky-500" />
            Cleaning
          </span>
        </div>
      </div>

      {/* Main Floor Container & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Floor Plan Layout (Matching Image Panel 2) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          {/* Area Selector Dropdown & Filter Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">Table Layout</span>
              <span className="text-xs text-slate-400">({filteredTables.length} tables in view)</span>
            </div>

            {/* Area Dropdown selector matching image: "Indoor Area ▾" */}
            <div className="relative">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value as any)}
                className="appearance-none px-4 py-2 pr-9 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a === 'All Areas' ? 'All Club Zones' : `${a} Area`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Graphical Floor Canvas Simulation matching image border aesthetics */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-100/90 to-slate-200/70 border-2 border-slate-300/80 shadow-inner min-h-[460px]">
            {/* Visual restaurant floor pillars/plants matching drawing in image */}
            <div className="absolute top-2 left-2 text-2xl select-none opacity-80">🪴</div>
            <div className="absolute top-2 right-2 text-2xl select-none opacity-80">🪴</div>
            <div className="absolute bottom-2 left-2 text-2xl select-none opacity-80">🚪</div>
            <div className="absolute bottom-2 right-2 text-2xl select-none opacity-80">🪴</div>

            {/* Grid of Tables: T1 2 Seats, T2 4 Seats, etc. */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredTables.map((table) => (
                <BarKitchenTableCard
                  key={table.id}
                  table={table}
                  isSelected={selectedTable?.id === table.id}
                  onClick={() => setSelectedTable(table)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 col: Selected Table Details & Action Panel */}
        <div className="space-y-4">
          {selectedTable ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Table Inspector
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    Table {selectedTable.tableNumber}
                  </h3>
                </div>
                <span
                  className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg ${
                    selectedTable.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedTable.status === 'Occupied'
                      ? 'bg-red-100 text-red-800'
                      : selectedTable.status === 'Reserved'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {selectedTable.status}
                </span>
              </div>

              {/* Table info */}
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Zone / Area:</span>
                  <span className="font-extrabold text-slate-800">{selectedTable.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seating Capacity:</span>
                  <span className="font-extrabold text-slate-800">{selectedTable.seats} Persons</span>
                </div>
                {selectedTable.stewardName && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Steward:</span>
                    <span className="font-extrabold text-blue-600">{selectedTable.stewardName}</span>
                  </div>
                )}
                {selectedTable.occupiedSince && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occupied Since:</span>
                    <span className="font-extrabold text-slate-800">{selectedTable.occupiedSince}</span>
                  </div>
                )}
                {selectedTable.activeBillAmount && (
                  <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-200">
                    <span className="text-slate-800">Running Bill:</span>
                    <span className="text-red-600">₹{selectedTable.activeBillAmount}</span>
                  </div>
                )}
                {selectedTable.reservedFor && (
                  <div className="pt-1 border-t border-slate-200 text-amber-800">
                    <strong>Reserved For:</strong> {selectedTable.reservedFor} (at {selectedTable.reservationTime})
                  </div>
                )}
              </div>

              {/* Status quick switcher */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                  Change Table State
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                  {(['Available', 'Occupied', 'Reserved', 'Cleaning'] as TableStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateTableStatus(selectedTable.id, st)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        selectedTable.status === st
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-extrabold shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Actions: Open in POS, Transfer, Merge */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleOpenPOSForTable}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Open in POS Terminal</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(true)}
                    className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                    <span>Transfer Table</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert(`Table ${selectedTable.tableNumber} merged with adjacent section.`)}
                    className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Merge className="w-3.5 h-3.5 text-slate-500" />
                    <span>Merge Table</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
              <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-bold">Select a table from the floor map to inspect details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Table Modal */}
      {showTransferModal && selectedTable && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-black text-slate-900">
              Transfer Table {selectedTable.tableNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Select an available destination table to transfer the active party, orders, and running bill.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Available Table
              </label>
              <select
                value={transferTargetId}
                onChange={(e) => setTransferTargetId(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-800"
              >
                <option value="">-- Choose Target Table --</option>
                {availableTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tableNumber} ({t.seats} Seats, {t.area})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!transferTargetId}
                onClick={handleConfirmTransfer}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
