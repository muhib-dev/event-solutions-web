import classname from "classnames";

const Modal = ({ children, open }) => {
  const modalClass = classname({
    "modal modal-top": true,
    "modal-open": open,
  });

  return (
    <div className={modalClass}>
      <div className="modal-box w-11/12 max-w-2xl mx-auto">{children}</div>
    </div>
  );
};

export default Modal;
