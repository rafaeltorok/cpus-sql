import "../../styles/tableControls.css";

import type { CpuType } from "../../types/types";

interface TableControlsProps {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  cpu: CpuType;
  setCpuData: (data: CpuType) => void;
  handleUpdate: () => Promise<void>;
  requestLoading: boolean;
  setShowConfirmDialog: (show: boolean) => void;
}

export default function TableControls({
  editMode,
  setEditMode,
  cpu,
  setCpuData,
  handleUpdate,
  requestLoading,
  setShowConfirmDialog,
}: TableControlsProps) {
  return (
    <tfoot>
      {editMode ? (
        <tr className="table-controls-row">
          <th>
            <button
              id="confirm-edit-button"
              onClick={() => void handleUpdate()}
              disabled={requestLoading}
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
              disabled={requestLoading}
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
              disabled={requestLoading}
            >
              Edit
            </button>
          </th>
          <td>
            <button
              id="delete-cpu-button"
              onClick={() => setShowConfirmDialog(true)}
              disabled={requestLoading}
            >
              Delete
            </button>
          </td>
        </tr>
      )}
    </tfoot>
  );
}
