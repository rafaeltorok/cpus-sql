// Components
import Cpu from "./Cpu";

// Component
export default function CpuList({ cpus, deleteCpu, showAll, scrollToIndex }) {
  return (
    <>
      {cpus.map(cpu => (
        <div key={cpu.id}>
          <Cpu
            key={cpu.id}
            cpu={cpu}
            onDelete={deleteCpu}
            showAll={showAll}
            id={`${cpu.manufacturer.toLowerCase()}-${cpu.model.toLowerCase()}`}
          />
          <button
            className='back-to-index-button'
            onClick={() => scrollToIndex(
              `${cpu.manufacturer.toLowerCase()}-${cpu.model.toLowerCase()}`
            )}
          >Back to Index</button>
        </div>
      ))}
    </>
  );
}
