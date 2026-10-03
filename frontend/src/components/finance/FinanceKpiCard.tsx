import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface FinanceKpiCardProps {
  title: string;
  value: string;
  growthPercent?: number;
  growthLabel?: string;
  icon: LucideIcon;
  variant?: 'green' | 'red' | 'blue' | 'amber' | 'purple' | 'slate';
  subtitle?: string;
  badge?: string;
}

export const FinanceKpiCard: React.FC<FinanceKpiCardProps> = ({
  title,
  value,
  growthPercent,
  growthLabel = 'vs last month',
  icon: Icon,
  variant = 'blue',
  subtitle,
  badge,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'green':
        return {
          iconBg: 'bg-emerald-100 text-emerald-600',
          growthColor: 'text-emerald-600',
          borderColor: 'border-emerald-100',
        };
      case 'red':
        return {
          iconBg: 'bg-rose-100 text-rose-600',
          growthColor: 'text-rose-600',
          borderColor: 'border-rose-100',
        };
      case 'blue':
        return {
          iconBg: 'bg-blue-100 text-blue-600',
          growthColor: 'text-emerald-600',
          borderColor: 'border-blue-100',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-100 text-amber-600',
          growthColor: 'text-rose-600',
          borderColor: 'border-amber-100',
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-100 text-purple-600',
          growthColor: 'text-purple-600',
          borderColor: 'border-purple-100',
        };
      case 'slate':
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-600',
          growthColor: 'text-slate-600',
          borderColor: 'border-slate-100',
        };
    }
  };

  const styles = getVariantStyles();
  const isPositive = growthPercent !== undefined && growthPercent >= 0;

  return (
    <div className={`bg-white rounded-3xl border ${styles.borderColor} p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}>
      <div>
        <div className="flex items-start justify-between">
          <div className={`w-11 h-11 rounded-2xl ${styles.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}>
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>

          {badge && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {badge}
            </span>
          )}
        </div>

        <div className="mt-3">
          <span className="text-xs font-bold text-slate-500 block tracking-tight">
            {title}
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            {value}
          </h3>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        {growthPercent !== undefined ? (
          <div className="flex items-center gap-1.5 font-bold">
            <span className={`flex items-center text-xs font-extrabold ${styles.growthColor}`}>
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              {Math.abs(growthPercent)}%
            </span>
            <span className="text-slate-400 font-medium text-[11px]">{growthLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400 font-medium text-[11px]">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
