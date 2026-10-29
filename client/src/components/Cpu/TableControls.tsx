import "../../styles/tableControls.css";

import type { CpuType } from "../../types/types";

interface TableControlsProps {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  cpu: CpuType;
  setCpuData: (data: CpuType) => void;
  handleUpdate: () => Promise<void>;
  onDelete: (id: number, manufacturer: string, model: string) => void;
}

export default function TableControls({ editMode, setEditMode, cpu, setCpuData, handleUpdate, onDelete}: TableControlsProps) {
  return (
    <tfoot>
      {editMode ? (
        <tr className="table-controls-row">
          <th>
            <button
              id="confirm-edit-button"
              onClick={() => void handleUpdate()}
            >
              Confirm
            </button>
          </th>
          <td>
            <button
              id="cancel-edit-button"
              onClick={() => {
                setEditMode(false);
                setCpuData(cpu);
              }}
            >
              Cancel
            </button>
          </td>
        </tr>
      ) : (
        <tr className="table-controls-row">
          <th>
            <button
              id="edit-mode-button"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          </th>
          <td>
            <button
              id="delete-cpu-button"
              onClick={() => onDelete(cpu.id, cpu.manufacturer, cpu.model)}
            >
              Delete
            </button>
          </td>
        </tr>
      )}
    </tfoot>
  )
}