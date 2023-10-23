const FormLabel = ({ title, className = "" }) => {
  return (
    <label className={`block mb-3 text-lg text-[#3C3B3B] ${className}`}>
      {title}
    </label>
  );
};

export default FormLabel;
