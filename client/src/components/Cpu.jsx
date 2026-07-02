import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "../styles/cpu.css";


// Render each data row inside the CPU table
function renderRow(rowName, rowData, cpuHeaderClass) {
	return (
		<tr>
			<th>{rowName}</th>
			<td className={cpuHeaderClass}>{rowData}</td>
		</tr>
	);
};

// Component
function Cpu ({ cpu, onDelete, showAll }) {
	const [showBody, setShowBody] = useState(false);

	// Sync individual state with global "Show All" toggle
	useEffect(() => {
		setShowBody(showAll);
	}, [showAll]);

	// Defines the manufacturer color for to style each table
	const cpuHeaderClass = 
		cpu.manufacturer.toLowerCase() === 'amd'
		? 'amd-model-header'
		: cpu.manufacturer.toLowerCase() === 'intel'
		? 'intel-model-header'
		: 'model-header';

	return (
		<table 
			id={`${cpu.manufacturer.toLowerCase()}-${cpu.model.toLowerCase()}`}
			className='cpu-data-table'
		>
			<thead>
				<tr>
					<th className={cpuHeaderClass}
						colSpan={2}
					>
						{cpu.manufacturer} {cpu.model}
					</th>
				</tr>
				<tr>
					<th colSpan={2} className='table-header'>
						<button
							className='show-hide-button'
							onClick={() => setShowBody(!showBody)}
						>
							{showBody ? "Hide" : "Show"}
						</button>
					</th>
				</tr>
			</thead>
			{showBody && (
				<tbody>
					<tr>
						<th className="table-header" colSpan={2}>SPECIFICATIONS</th>
					</tr>
					{renderRow('CORES / THREADS', `${cpu.cores} / ${cpu.threads}`, cpuHeaderClass)}
          {renderRow('CACHE', `${cpu.cache} MB`, cpuHeaderClass)}
          {renderRow('BASE CLOCK', `${cpu.baseclock} GHz`, cpuHeaderClass)}
          {renderRow('BOOST CLOCK', `${cpu.boostclock} GHz`, cpuHeaderClass)}
          {renderRow('ARCHITECTURE', `${cpu.architecture}`, cpuHeaderClass)}
          {renderRow('SOCKET', `${cpu.mbsocket}`, cpuHeaderClass)}
					<tr>
						<td colSpan={"2"} id='delete-cpu-button'>
							<button onClick={() => onDelete(cpu.id, cpu.manufacturer, cpu.model)}>Delete</button>
						</td>
					</tr>
				</tbody>
			)}
		</table>
	)
}

Cpu.displayName = "CPU";

Cpu.propTypes = {
  cpu: PropTypes.shape({
    id: PropTypes.string.isRequired,
    manufacturer: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    cores: PropTypes.number.isRequired,
    threads: PropTypes.number.isRequired,
		cache: PropTypes.number.isRequired,
    baseclock: PropTypes.number.isRequired,
    boostclock: PropTypes.number.isRequired,
    architecture: PropTypes.string.isRequired,
		mbsocket: PropTypes.string.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  showAll: PropTypes.bool.isRequired
}

export default Cpu;