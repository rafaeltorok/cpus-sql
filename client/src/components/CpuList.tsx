// Components
import Cpu from "./Cpu";

// TypeScript types
import type { CpuType } from "../types/types";

interface CpuListProps {
  cpus: CpuType[];
  deleteCpu: (id: number, manufacturer: string, model: string) => void;
  showAll: boolean;
  scrollToIndex: (cpuTableId: string) => void;
}

// Component
export default function CpuList({
  cpus,
  deleteCpu,
  showAll,
  scrollToIndex,
}: CpuListProps) {
  return (
    <>
      {cpus.map((cpu) => (
        <div key={cpu.id}>
          <Cpu key={cpu.id} cpu={cpu} onDelete={deleteCpu} showAll={showAll} />
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
      ))}
    </>
  );
}
