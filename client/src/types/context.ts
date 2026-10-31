import type React from "react";
import type { CpuType, NewCpu } from "./types";

export type UiState = {
  searchCpu: string;
  showSearch: boolean;
  showAll: boolean;
  showAddForm: boolean;
  showIndex: boolean;
};

export type UiActions =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_SEARCH" }
  | { type: "TOGGLE_SHOW_ALL" }
  | { type: "TOGGLE_ADD_FORM" }
  | { type: "TOGGLE_INDEX" };

export type DataState = {
  cpus: CpuType[];
  cpusFound: CpuType[];
  loading: boolean;
  error: string | null;
};

export type DataActions =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: CpuType[] }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "SET_FOUND"; payload: CpuType[] }
  | { type: "ADD_CPU"; payload: CpuType }

export type CpuContextType = {
  addCpu: (cpu: NewCpu) => Promise<boolean>;
  updateCpu: (cpu: CpuType) => Promise<boolean>;
  deleteCpu: (cpu: CpuType) => Promise<boolean>;
  dataState: DataState;
  dataDispatch: React.Dispatch<DataActions>;
  uiState: UiState;
  uiDispatch: React.Dispatch<UiActions>;
};
