import type { CpuType } from "../../types/types";

interface DataRowProps {
  rowName: string;
  rowData: string;
  cpuHeaderClass: string;
  editMode: boolean;
  type: string;
  dataName: string;
  dataValue: string | number;
  cpuData: CpuType;
  setCpuData: (data: CpuType) => void;
}

// Render each data row inside the CPU table
export default function DataRow({
  rowName,
  rowData,
  cpuHeaderClass,
  editMode,
  type,
  dataName,
  dataValue,
  cpuData,
  setCpuData,
}: DataRowProps) {
  function handleChange(value: string) {
    if (type === "text") {
      setCpuData({ ...cpuData, [dataName]: value.trim() });
    } else {
      setCpuData({ ...cpuData, [dataName]: Number(value.trim()) });
    }
  }

  return (
    <>
      {editMode ? (
        <tr className="edit-mode-row">
          <th>
            <label htmlFor={`${dataName}-input`}>{rowName}</label>
          </th>
          <td>
            <input
              id={`${dataName}-input`}
              className="edit-input-field"
              type={type}
              defaultValue={dataValue || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          </td>
        </tr>
      ) : (
        <tr>
          <th>{rowName}</th>
          <td className={cpuHeaderClass}>{rowData}</td>
        </tr>
      )}
    </>
  );
}
