import PropTypes from "prop-types";

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

CpuList.displayName = "CpuList";

CpuList.prototype = {
  cpus: PropTypes.array.isRequired,
  deleteCpu: PropTypes.func.isRequired,
  showAll: PropTypes.bool.isRequired,
  scrollToIndex: PropTypes.func.isRequired,
};
