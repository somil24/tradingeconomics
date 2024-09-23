import { create } from "zustand";

interface CountryStore {
  country: string;
  index: string;
  symbol: string;
  setCountry: (by: string) => void;
  setIndex: (by: string) => void;
  setSymbol: (by: string) => void;
}

const useCountryStore = create<CountryStore>()((set) => ({
  country: "",
  index: "",
  symbol: "",
  setCountry: (by) => set((state) => ({ country: by })),
  setIndex: (by) => set((state) => ({ index: by })),
  setSymbol: (by) => set((state) => ({ symbol: by })),
}));

export default useCountryStore;
