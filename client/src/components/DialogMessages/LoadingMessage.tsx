import { useEffect, useRef } from "react";
import useCpuContext from "../../hooks/useCpuContext";

import "../../styles/messages.css";

export default function LoadingMessage() {
  const ref = useRef<HTMLDialogElement>(null);
  const { uiState } = useCpuContext();

  useEffect(() => {
    if (uiState.loadingMessage) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [uiState.loadingMessage]);

  return (
    <dialog
      className="dialog-container"
      ref={ref}
      onCancel={(e) => e.preventDefault()} // stop Esc from closing it mid-load
    >
      <p className="dialog-message">{uiState.dialogMessage}</p>
    </dialog>
  );
}
