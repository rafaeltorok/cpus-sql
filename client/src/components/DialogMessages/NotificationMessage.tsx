import { useEffect, useRef } from "react";
import useCpuContext from "../../hooks/useCpuContext";

import "../../styles/messages.css";

export default function NotificationMessage() {
  const ref = useRef<HTMLDialogElement>(null);
  const { uiState, uiDispatch } = useCpuContext();

  useEffect(() => {
    if (uiState.notificationMessage) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [uiState.notificationMessage]);

  return (
    <dialog
      className="dialog-container"
      ref={ref}
      onCancel={(e) => e.preventDefault()} // stop Esc from closing it mid-load
    >
      <p className="dialog-message">{uiState.dialogMessage}</p>
      <button className="dialog-button" onClick={() => {
        uiDispatch({ type: "TOGGLE_NOTIFICATION_MESSAGE", payload: false });
      }}>
        Close
      </button>
    </dialog>
  );
}
