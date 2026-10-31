import useCpuContext from "../hooks/useCpuContext";

// Components
import Cpu from "./Cpu/Cpu";

// TypeScript types
import type { CpuType } from "../types/types";

interface CpuListProps {
  scrollToIndex: (cpuTableId: string) => void;
}

export default function CpuList({
  scrollToIndex,
}: CpuListProps) {
  const { uiState, dataState } = useCpuContext();

  if (dataState.loading) return <h2>Loading CPUs, please wait...</h2>;

  if (dataState.error) return <h2>Error: {dataState.error}</h2>;

  // Filter the list based on the search term, if available
  const cpusData = uiState.searchCpu ? dataState.cpusFound : dataState.cpus;

  return (
    <>
      {cpusData.length === 0 ? (
        <h2>No CPUs were found</h2>
      ) : (
        cpusData.map((cpu: CpuType) => (
          <div key={cpu.id}>
            <Cpu
              cpu={cpu}
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
