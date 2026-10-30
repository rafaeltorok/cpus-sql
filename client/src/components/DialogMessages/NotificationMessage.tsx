import { useEffect, useRef } from "react";

import "../../styles/messages.css";

interface NotificationMessageProps {
  showMessage: boolean;
  setShowMessage: (show: boolean) => void;
  message: string;
}

export default function NotificationMessage({
  showMessage,
  setShowMessage,
  message
}: NotificationMessageProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (showMessage) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [showMessage]);

  return (
    <dialog
      className="dialog-container"
      ref={ref}
      onCancel={(e) => e.preventDefault()} // stop Esc from closing it mid-load
    >
      <p className="dialog-message">{message}</p>
      <button
        className="dialog-button"
        onClick={() => setShowMessage(false)}
      >
        Close
      </button>
    </dialog>
  );
}
