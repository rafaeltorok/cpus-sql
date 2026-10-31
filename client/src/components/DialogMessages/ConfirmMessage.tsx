import { useEffect, useRef } from "react";
import useCpuContext from "../../hooks/useCpuContext";

interface ConfirmMessageProps {
  handleDelete: () => void;
}

export default function ConfirmMessage({
  handleDelete,
}: ConfirmMessageProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { uiState, uiDispatch } = useCpuContext();

  useEffect(() => {
    if (uiState.confirmationMessage) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [uiState.confirmationMessage]);

  return (
    <dialog
      className="dialog-container"
      ref={ref}
      onCancel={(e) => e.preventDefault()} // stop Esc from closing it mid-load
    >
      <p className="dialog-message">{uiState.dialogMessage}</p>
      <div className="dialog-buttons-wrapper">
        <button
          className="dialog-button"
          onClick={() => {
            uiDispatch({ type: "TOGGLE_CONFIRMATION_MESSAGE", payload: false });
            handleDelete();
          }}
        >
          Confirm
        </button>
        <button className="dialog-button" onClick={() => {
          uiDispatch({ type: "TOGGLE_CONFIRMATION_MESSAGE", payload: false });
        }}>
          Cancel
        </button>
      </div>
    </dialog>
  );
}
