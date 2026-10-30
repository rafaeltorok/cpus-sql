import { useEffect, useRef } from "react";

import "../styles/popupMessage.css";

interface PopupMessageProps {
  requestLoading: boolean;
}

export default function PopupMessage({ requestLoading }: PopupMessageProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (requestLoading) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [requestLoading]);

  return (
    <dialog
      className="popup-container"
      ref={ref}
      onCancel={(e) => e.preventDefault()} // stop Esc from closing it mid-load
    >
      <p className="popup-message">Sending request, please wait...</p>
    </dialog>
  );
}
