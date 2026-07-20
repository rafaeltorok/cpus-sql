// Components
import Cpu from "./Cpu";

// TypeScript types
import type { CpuType } from "../types/types";

interface CpuListProps {
  cpus: CpuType[];
  deleteCpu: (id: number, manufacturer: string, model: string) => void;
  showAll: boolean;
  scrollToIndex: (cpuTableId: string) => void;
  loading: boolean;
  error: string;
}

// Component
export default function CpuList({
  cpus,
  deleteCpu,
  showAll,
  scrollToIndex,
  loading,
  error,
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
              onDelete={deleteCpu}
              showAll={showAll}
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
