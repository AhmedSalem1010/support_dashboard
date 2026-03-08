'use client';

import { Package } from 'lucide-react';

export type EquipmentKey = 
  | "blicher" 
  | "bakium" 
  | "ladderBig" 
  | "ladderSmall" 
  | "leMay" 
  | "leBakium" 
  | "leShoft" 
  | "noselShaft" 
  | "noselMay" 
  | "noselKabir";

export const EQUIPMENT_LABELS: Record<EquipmentKey, string> = {
  blicher: "البليشر",
  bakium: "الباكيوم",
  ladderBig: "السلم الكبير",
  ladderSmall: "السلم الصغير",
  leMay: "لي الماء",
  leBakium: "لي الباكيوم",
  leShoft: "لي الشفط",
  noselShaft: "نوسل شفط",
  noselMay: "نوسل ماء",
  noselKabir: "نوسل كبير",
};

interface EquipmentInventoryGridProps {
  equipment: Record<EquipmentKey, number>;
  onChange?: (equipment: Record<EquipmentKey, number>) => void;
  readOnly?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

const BoxIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    width="24" 
    height="24"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

export function EquipmentInventoryGrid({ 
  equipment, 
  onChange, 
  readOnly = false,
  isLoading = false,
  error = null
}: EquipmentInventoryGridProps) {
  
  const handleIncrement = (key: EquipmentKey) => {
    if (readOnly || !onChange) return;
    onChange({ ...equipment, [key]: equipment[key] + 1 });
  };

  const handleDecrement = (key: EquipmentKey) => {
    if (readOnly || !onChange) return;
    onChange({ ...equipment, [key]: Math.max(0, equipment[key] - 1) });
  };

  const handleDirectChange = (key: EquipmentKey, value: number) => {
    if (readOnly || !onChange) return;
    onChange({ ...equipment, [key]: Math.max(0, value) });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-teal-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg">
              <Package className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">جرد العهدة</h3>
          </div>
          {isLoading && (
            <span className="text-sm text-teal-600 font-semibold">جاري التحميل...</span>
          )}
          {error && (
            <span className="text-sm text-red-600 font-semibold">{error}</span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.entries(equipment) as [EquipmentKey, number][]).map(([key, count]) => (
            <div
              key={key}
              className={`
                relative rounded-xl border-2 p-4 transition-all duration-200
                ${count > 0 
                  ? 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-400' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}
            >
              {/* Icon and Label */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${count > 0 ? 'bg-teal-500/20 text-teal-600' : 'bg-gray-300/50 text-gray-500'}
                `}>
                  <BoxIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {EQUIPMENT_LABELS[key]}
                  </h4>
                </div>
              </div>

              {/* Counter */}
              <div className="flex items-center justify-center gap-3">
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleDecrement(key)}
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 bg-white hover:border-teal-500 hover:bg-teal-50 transition-all flex items-center justify-center text-gray-600 hover:text-teal-600 font-bold"
                  >
                    −
                  </button>
                )}
                
                {readOnly ? (
                  <div className={`
                    text-3xl font-black text-center min-w-[60px]
                    ${count > 0 ? 'text-teal-600' : 'text-gray-400'}
                  `}>
                    {count}
                  </div>
                ) : (
                  <input
                    type="number"
                    min={0}
                    value={count}
                    onChange={(e) => handleDirectChange(key, parseInt(e.target.value) || 0)}
                    className={`
                      w-16 text-center text-3xl font-black border-0 bg-transparent focus:ring-0 p-0
                      ${count > 0 ? 'text-teal-600' : 'text-gray-400'}
                    `}
                  />
                )}

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleIncrement(key)}
                    className="w-8 h-8 rounded-lg border-2 border-gray-300 bg-white hover:border-teal-500 hover:bg-teal-50 transition-all flex items-center justify-center text-gray-600 hover:text-teal-600 font-bold"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
