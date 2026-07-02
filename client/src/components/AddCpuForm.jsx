import { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';

// Components
import FormRow from './FormRow';

// Styles
import "../styles/addCpuForm.css";


// Component
const AddCpuForm = forwardRef(({ createCpu }, ref) => {
	const [cpuSpecs, setCpuSpecs] = useState({
		manufacturer: "",
		model: "",
		cores: 0,
		threads: 0,
		cache: 0,
		baseclock: 0,
		boostclock: 0,
		architecture: "",
		mbsocket: "",
	});
	const [showAddForm, setShowAddForm] = useState(false);

	useImperativeHandle(ref, () => ({
		toggleVisibility: () => setShowAddForm(prev => !prev)
	}));

	const addCpu = (event) => {
		event.preventDefault();
		createCpu({
			manufacturer: cpuSpecs.manufacturer.trim(),
			model: cpuSpecs.model.trim(),
			cores: cpuSpecs.cores,
			threads: cpuSpecs.threads,
			cache: cpuSpecs.cache,
			baseclock: cpuSpecs.baseclock,
			boostclock: cpuSpecs.boostclock,
			architecture: cpuSpecs.architecture.trim(),
			mbsocket: cpuSpecs.mbsocket.trim()
		});

		setCpuSpecs({
			manufacturer: "",
			model: "",
			cores: 0,
			threads: 0,
			cache: 0,
			baseclock: 0,
			boostclock: 0,
			architecture: "",
			mbsocket: "",
		});
	}

	return (
		<div>
			<form onSubmit={addCpu} id="add-cpu-form">
				<fieldset className="add-cpu-field">
					<button
						id='add-cpu-button'
						type='button'
						onClick={() => setShowAddForm((prev) => !prev)}
					>
						{showAddForm ? "Cancel" : "Add Processor"}
					</button>
					
					{showAddForm && (
						<fieldset className="add-cpu-field">
							<FormRow
								id="manufacturer"
								type="text"
								label="Manufacturer"
								placeholder="AMD"
								value={cpuSpecs.manufacturer}
								onChange={(e) => setCpuSpecs({ ...cpuSpecs, manufacturer: e.target.value })}
							/>

							<FormRow
								id="model"
								type="text"
								label="Model"
								placeholder="Ryzen 7 5800X"
								value={cpuSpecs.model}
								onChange={(e) => setCpuSpecs({ ...cpuSpecs, model: e.target.value })}
							/>

							<FormRow
								id="cores"
								type="number"
								label="Cores"
								placeholder="8"
								value={cpuSpecs.cores}
								onChange={(e) => setCpuSpecs({ ...cpuSpecs, cores: e.target.value })}
							/>

							<FormRow
								id="threads"
								type="number"
								label="Threads"
								placeholder="16"
								value={cpuSpecs.threads}
								onChange={(e) => setCpuSpecs({ ...cpuSpecs, threads: e.target.value })}
							/>

							<FormRow
								id="cache"
								type="number"
								label="Cache (MB)"
								placeholder="36"
								value={cpuSpecs.cache}
								onChange={(e) => setCpuSpecs({ ...cpuSpecs, cache: e.target.value })}
							/>

							<FormRow
								id="baseclock"
								type="number"
								label="Base Clock (GHz)"
								placeholder="3.8"
								value={cpuSpecs.baseclock}
								onChange={(e) => setCpuSpecs({ ...cpuSpecs, baseclock: e.target.value })}
							/>

							<FormRow
								id="boostclock"
								type="number"
								label="Boost Clock (GHz)"
								placeholder="4.7"
								value={cpuSpecs.boostclock}
								onChange={(e) => setCpuSpecs({ ...cpuSpecs, boostclock: e.target.value })}
							/>

							<FormRow
								id="architecture"
								type="text"
								label="Architecture"
								placeholder="Zen 3"
								value={cpuSpecs.architecture}
								onChange={(e) => setCpuSpecs({ ...cpuSpecs, architecture: e.target.value })}
							/>

							<FormRow
								id="mbsocket"
								type="text"
								label="Socket"
								placeholder="AM4"
								value={cpuSpecs.mbsocket}
								onChange={(e) => setCpuSpecs({ ...cpuSpecs, mbsocket: e.target.value })}
							/>

							<div className="form-row">
								<button className="add-cpu-submit-button" type="submit">
									Submit
								</button>
							</div>
						</fieldset>
					)}
				</fieldset>
			</form>
		</div>
	)
});

AddCpuForm.displayName = "AddCpuForm";

AddCpuForm.propTypes = {
	createCpu: PropTypes.func.isRequired
}

export default AddCpuForm;