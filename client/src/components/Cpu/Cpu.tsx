import { useState, useEffect } from "react";
import DataRow from "./DataRow";
import TableControls from "./TableControls";

// CSS styles
import "../../styles/cpu.css";

// TypeScript types
import type { CpuType } from "../../types/types";

interface CpuProps {
  cpu: CpuType;
  onUpdate: (specs: CpuType) => Promise<boolean>;
  onDelete: (id: number, manufacturer: string, model: string) => void;
  showAll: boolean;
}

// Component
export default function Cpu({ cpu, onUpdate, onDelete, showAll }: CpuProps) {
  const [showBody, setShowBody] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Creates an editable copy of the original data
  const [cpuData, setCpuData] = useState(cpu);

  // Sync individual state with global "Show All" toggle
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowBody(showAll);
  }, [showAll]);

  // Handles calling the update function with the new specs data
  async function handleUpdate(): Promise<void> {
    const confirm = await onUpdate(cpuData);

    // If the update fails, reset the specs to the original values
    if (!confirm) {
      setCpuData(cpu);
    } else {
      // Only leave the edit mode if the update succeeds
      setEditMode(false);
    }
  }

  // Defines the manufacturer color for to style each table
  const cpuHeaderClass =
    cpu.manufacturer.toLowerCase() === "amd"
      ? "amd-model-header"
      : cpu.manufacturer.toLowerCase() === "intel"
        ? "intel-model-header"
        : "model-header";

  return (
    <table
      id={`${cpu.manufacturer.toLowerCase()}-${cpu.model.toLowerCase()}`}
      className="cpu-data-table"
    >
      <thead>
        <tr>
          <th className={cpuHeaderClass} colSpan={2}>
            {cpu.manufacturer} {cpu.model}
          </th>
        </tr>
        <tr>
          <th colSpan={2} className="table-header">
            <button
              className="show-hide-button"
              onClick={() => setShowBody(!showBody)}
            >
              {showBody ? "Hide" : "Show"}
            </button>
          </th>
        </tr>
      </thead>
      {showBody && (
        <>
          <tbody>
            <tr>
              <th className="table-header" colSpan={2}>
                SPECIFICATIONS
              </th>
            </tr>

            <DataRow
              rowName="CORES / THREADS"
              rowData={`${cpu.cores} / ${cpu.threads}`}
              cpuHeaderClass={cpuHeaderClass}
              editMode={editMode}
              type="number"
              dataName="cores"
              dataValue={cpu.cores}
              cpuData={cpuData}
              setCpuData={setCpuData}
            />
            <DataRow
              rowName="CACHE"
              rowData={`${cpu.cache} MB`}
              cpuHeaderClass={cpuHeaderClass}
              editMode={editMode}
              type="number"
              dataName="cache"
              dataValue={cpu.cache}
              cpuData={cpuData}
              setCpuData={setCpuData}
            />
            <DataRow
              rowName="BASE CLOCK"
              rowData={`${cpu.baseclock} GHz`}
              cpuHeaderClass={cpuHeaderClass}
              editMode={editMode}
              type="number"
              dataName="baseclock"
              dataValue={cpu.baseclock}
              cpuData={cpuData}
              setCpuData={setCpuData}
            />
            <DataRow
              rowName="BOOST CLOCK"
              rowData={`${cpu.boostclock} GHz`}
              cpuHeaderClass={cpuHeaderClass}
              editMode={editMode}
              type="number"
              dataName="boostclock"
              dataValue={cpu.boostclock}
              cpuData={cpuData}
              setCpuData={setCpuData}
            />
            <DataRow
              rowName="ARCHITECTURE"
              rowData={`${cpu.architecture}`}
              cpuHeaderClass={cpuHeaderClass}
              editMode={editMode}
              type="string"
              dataName="architecture"
              dataValue={cpu.architecture}
              cpuData={cpuData}
              setCpuData={setCpuData}
            />
            <DataRow
              rowName="SOCKET"
              rowData={`${cpu.mbsocket}`}
              cpuHeaderClass={cpuHeaderClass}
              editMode={editMode}
              type="string"
              dataName="mbsocket"
              dataValue={cpu.mbsocket}
              cpuData={cpuData}
              setCpuData={setCpuData}
            />
            <DataRow
              rowName="TDP"
              rowData={cpu.tdp ? `${cpu.tdp} W` : "N/A"}
              cpuHeaderClass={cpuHeaderClass}
              editMode={editMode}
              type="number"
              dataName="tdp"
              dataValue={cpu.tdp || 0}
              cpuData={cpuData}
              setCpuData={setCpuData}
            />
          </tbody>

          <TableControls
            editMode={editMode}
            setEditMode={setEditMode}
            cpu={cpu}
            setCpuData={setCpuData}
            handleUpdate={handleUpdate}
            onDelete={onDelete}
          />
        </>
      )}
    </table>
  );
}
