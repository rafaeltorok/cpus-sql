import { useEffect, useRef } from "react";

interface ConfirmMessageProps {
  showMessage: boolean;
  setShowMessage: (show: boolean) => void;
  message: string;
  handleDelete: () => void;
}

export default function ConfirmMessage({
  showMessage,
  setShowMessage,
  message,
  handleDelete,
}: ConfirmMessageProps) {
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
      <div className="dialog-buttons-wrapper">
        <button
          className="dialog-button"
          onClick={() => {
            setShowMessage(false);
            handleDelete();
          }}
        >
          Confirm
        </button>
        <button
          className="dialog-button"
          onClick={() => setShowMessage(false)}
        >
          Cancel
        </button>
      </div>
    </dialog>
  );
}