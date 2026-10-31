import useCpuContext from "../hooks/useCpuContext";

// Components
import Cpu from "./Cpu/Cpu";

// TypeScript types
import type { CpuType } from "../types/types";

interface CpuListProps {
  scrollToIndex: (cpuTableId: string) => void;
  requestLoading: boolean;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
}

export default function CpuList({
  scrollToIndex,
  requestLoading,
  showConfirmDialog,
  setShowConfirmDialog,
}: CpuListProps) {
  const { uiState, dataState } = useCpuContext();

  if (dataState.loading) return <h2>Loading CPUs, please wait...</h2>;

  if (dataState.error) return <h2>Error: {dataState.error}</h2>;

  const cpusData = uiState.searchCpu ? dataState.cpusFound : dataState.cpus;

  return (
    <>
      {cpusData.length === 0 ? (
        <h2>No CPUs were found</h2>
      ) : (
        cpusData.map((cpu: CpuType) => (
          <div key={cpu.id}>
            <Cpu
              key={cpu.id}
              cpu={cpu}
              requestLoading={requestLoading}
              showConfirmDialog={showConfirmDialog}
              setShowConfirmDialog={setShowConfirmDialog}
            />
            <button
              className="back-to-index-button"
              onClick={() =>
                scrollToIndex(
                  `${cpu.manufacturer.toLowerCase()}-${cpu.model.toLowerCase()}`,
                )
              }
            >
              Back to Index
            </button>
          </div>
        ))
      )}
    </>
  );
}
