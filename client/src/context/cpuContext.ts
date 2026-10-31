import { createContext } from "react";
import type { CpuContextType } from "../types/context";

const CpuContext = createContext<CpuContextType | null>(null);

export default CpuContext;
