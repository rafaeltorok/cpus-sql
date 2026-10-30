import { useEffect, useRef } from "react";

import "../../styles/messages.css";

interface LoadingMessageProps {
  showMessage: boolean;
  message: string;
}

export default function LoadingMessage({
  showMessage,
  message,
}: LoadingMessageProps) {
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
    </dialog>
  );
}
