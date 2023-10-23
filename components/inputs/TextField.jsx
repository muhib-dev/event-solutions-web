import { forwardRef } from "react";

const TextField = forwardRef((props, ref) => {
  const { type = "text", className = "", ...rest } = props;

  return (
    <input type={type} className={`input ${className}`} ref={ref} {...rest} />
  );
});

TextField.displayName = "TextField";

export default TextField;
