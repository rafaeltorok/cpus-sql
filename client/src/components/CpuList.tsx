// Components
import Cpu from "./Cpu/Cpu";

// TypeScript types
import type { CpuType } from "../types/types";

interface CpuListProps {
  cpus: CpuType[];
  updateCpu: (specs: CpuType) => Promise<boolean>;
  deleteCpu: (
    id: number,
    manufacturer: string,
    model: string,
  ) => Promise<boolean>;
  showAll: boolean;
  scrollToIndex: (cpuTableId: string) => void;
  loading: boolean;
  error: string;
  requestLoading: boolean;
}

// Component
export default function CpuList({
  cpus,
  updateCpu,
  deleteCpu,
  showAll,
  scrollToIndex,
  loading,
  error,
  requestLoading,
}: CpuListProps) {
  if (loading) return <h2>Loading CPUs, please wait...</h2>;

  if (error) return <h2>Error: {error}</h2>;

  return (
    <>
      {cpus.length === 0 ? (
        <h2>No CPUs were found</h2>
      ) : (
        cpus.map((cpu) => (
          <div key={cpu.id}>
            <Cpu
              key={cpu.id}
              cpu={cpu}
              onUpdate={updateCpu}
              onDelete={deleteCpu}
              showAll={showAll}
              requestLoading={requestLoading}
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
