import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TemperatureUnit = 'C' | 'F';

interface TemperatureState {
  unit: TemperatureUnit;
  toggleUnit: () => void;
}

export const useTemperatureUnit = create<TemperatureState>()(
  persist(
    (set) => ({
      unit: 'C',
      toggleUnit: () => set((state) => ({ unit: state.unit === 'C' ? 'F' : 'C' })),
    }),
    {
      name: 'temperature-unit',
    }
  )
);
