import useCpuContext from "../../hooks/useCpuContext";

import "../../styles/tableControls.css";

import type { CpuType } from "../../types/types";

interface TableControlsProps {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  cpu: CpuType;
  setCpuData: (data: CpuType) => void;
  handleUpdate: () => Promise<void>;
}

export default function TableControls({
  editMode,
  setEditMode,
  cpu,
  setCpuData,
  handleUpdate,
}: TableControlsProps) {
  const { uiState, uiDispatch } = useCpuContext();

  return (
    <tfoot>
      {editMode ? (
        <tr className="table-controls-row">
          <th>
            <button
              id="confirm-edit-button"
              onClick={() => void handleUpdate()}
              disabled={uiState.loadingMessage}
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
              disabled={uiState.loadingMessage}
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
              disabled={uiState.loadingMessage}
            >
              Edit
            </button>
          </th>
          <td>
            <button
              id="delete-cpu-button"
              onClick={() => uiDispatch({ type: "TOGGLE_CONFIRMATION_MESSAGE", payload: true })}
              disabled={uiState.loadingMessage}
            >
              Delete
            </button>
          </td>
        </tr>
      )}
    </tfoot>
  );
}
