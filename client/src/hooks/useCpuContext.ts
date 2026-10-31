import { useContext } from "react";
import CpuContext from "../context/cpuContext";

// TypeScript types
import type { CpuContextType } from "../types/context";

export default function useCpuContext(): CpuContextType {
  const context = useContext(CpuContext);

  if (!context) throw new Error("CpuContext must be used within a Provider");

  return context;
}
