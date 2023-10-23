const ErrorLabel = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <label className={`block mt-2 text-rose-600 ${className}`}>{message}</label>
  );
};

export default ErrorLabel;
