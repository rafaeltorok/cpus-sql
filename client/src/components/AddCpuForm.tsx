// React
import { useState } from "react";

// Components
import FormRow from "./FormRow";

// CSS styles
import "../styles/addCpuForm.css";

// TypeScript types
import type { NewCpu } from "../types/types";

interface AddCpuFormProps {
  addCpu: (cpu: NewCpu) => Promise<boolean>;
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

type Event = React.ChangeEvent<HTMLInputElement>;

// Component
export default function AddCpuForm({
  addCpu,
  showAddForm,
  setShowAddForm,
}: AddCpuFormProps) {
  const [cpuSpecs, setCpuSpecs] = useState<NewCpu>({
    manufacturer: "",
    model: "",
    cores: 0,
    threads: 0,
    cache: 0,
    baseclock: 0,
    boostclock: 0,
    architecture: "",
    mbsocket: "",
    tdp: 0,
  });

  // Handle the add form submit
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    // Add the CPU
    const response = await addCpu({
      manufacturer: cpuSpecs.manufacturer.trim(),
      model: cpuSpecs.model.trim(),
      cores: cpuSpecs.cores,
      threads: cpuSpecs.threads,
      cache: cpuSpecs.cache,
      baseclock: cpuSpecs.baseclock,
      boostclock: cpuSpecs.boostclock,
      architecture: cpuSpecs.architecture.trim(),
      mbsocket: cpuSpecs.mbsocket.trim(),
      tdp: cpuSpecs.tdp,
    });

    // If the CPU was successfully added, close the form and clear the input data
    if (response) {
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
        tdp: 0,
      });

      setShowAddForm(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        id="add-cpu-form"
      >
        <fieldset className="add-cpu-field">
          <button
            id="add-cpu-button"
            type="button"
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
                onChange={(e: Event) =>
                  setCpuSpecs({ ...cpuSpecs, manufacturer: e.target.value })
                }
              />

              <FormRow
                id="model"
                type="text"
                label="Model"
                placeholder="Ryzen 7 5800X"
                value={cpuSpecs.model}
                onChange={(e: Event) =>
                  setCpuSpecs({ ...cpuSpecs, model: e.target.value })
                }
              />

              <FormRow
                id="cores"
                type="number"
                label="Cores"
                placeholder="8"
                value={String(cpuSpecs.cores)}
                onChange={(e: Event) =>
                  setCpuSpecs({ ...cpuSpecs, cores: Number(e.target.value) })
                }
              />

              <FormRow
                id="threads"
                type="number"
                label="Threads"
                placeholder="16"
                value={String(cpuSpecs.threads)}
                onChange={(e: Event) =>
                  setCpuSpecs({ ...cpuSpecs, threads: Number(e.target.value) })
                }
              />

              <FormRow
                id="cache"
                type="number"
                label="Cache (MB)"
                placeholder="36"
                value={String(cpuSpecs.cache)}
                onChange={(e: Event) =>
                  setCpuSpecs({ ...cpuSpecs, cache: Number(e.target.value) })
                }
              />

              <FormRow
                id="baseclock"
                type="number"
                label="Base Clock (GHz)"
                placeholder="3.8"
                value={String(cpuSpecs.baseclock)}
                onChange={(e: Event) =>
                  setCpuSpecs({
                    ...cpuSpecs,
                    baseclock: Number(e.target.value),
                  })
                }
              />

              <FormRow
                id="boostclock"
                type="number"
                label="Boost Clock (GHz)"
                placeholder="4.7"
                value={String(cpuSpecs.boostclock)}
                onChange={(e: Event) =>
                  setCpuSpecs({
                    ...cpuSpecs,
                    boostclock: Number(e.target.value),
                  })
                }
              />

              <FormRow
                id="architecture"
                type="text"
                label="Architecture"
                placeholder="Zen 3"
                value={cpuSpecs.architecture}
                onChange={(e: Event) =>
                  setCpuSpecs({ ...cpuSpecs, architecture: e.target.value })
                }
              />

              <FormRow
                id="mbsocket"
                type="text"
                label="Socket"
                placeholder="AM4"
                value={cpuSpecs.mbsocket}
                onChange={(e: Event) =>
                  setCpuSpecs({ ...cpuSpecs, mbsocket: e.target.value })
                }
              />

              <FormRow
                id="tdp"
                type="number"
                label="TDP (W)"
                placeholder="105"
                value={String(cpuSpecs.tdp)}
                onChange={(e: Event) => {
                  setCpuSpecs({
                    ...cpuSpecs,
                    tdp: Number(e.target.value),
                  });
                }}
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
  );
}
