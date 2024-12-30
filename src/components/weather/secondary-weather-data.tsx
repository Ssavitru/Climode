import { ReactNode } from 'react';

interface SecondaryWeatherDataProps {
  label: string;
  icon: ReactNode;
  value: ReactNode | string | number;
}

export function SecondaryWeatherData({ label, icon, value }: SecondaryWeatherDataProps) {
  return (
    <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 font-sans">
      <div className="text-white/60">
        {icon}
      </div>
      <div>
        <div className="text-xs text-white/80 font-display">{label}</div>
        <div className="text-sm font-semibold text-white ">
          {value}
        </div>
      </div>
    </div>
  );
}
