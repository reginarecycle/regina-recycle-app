import { type FC, type InputHTMLAttributes, useState } from "react";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { type UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  register: UseFormRegisterReturn;
  error?: string;
  label: string;
  id?: string;
  helperText?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const InputField: FC<InputFieldProps> = ({
  register,
  error,
  label,
  id,
  helperText,
  placeholder,
  type = "text",
  showPasswordToggle = false,
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = id || `field-${register.name}`;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Field data-invalid={!!error} className="relative">
      <FieldLabel htmlFor={fieldId}>
  {label}
  {inputProps.required && (
    <span className="text-destructive ml-0.5">*</span>
  )}
</FieldLabel>
      <div className="relative">
        <Input
          {...register}
          {...inputProps}
          id={fieldId}
          type={showPasswordToggle && showPassword ? "text" : type}
          aria-invalid={!!error}
          placeholder={placeholder}
          className={showPasswordToggle ? "pr-10" : ""}
        />
        {showPasswordToggle && (
          <div
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </div>
        )}
      </div>
      {error && <FieldError errors={[{ message: error }]} />}
      {!error && helperText && (
        <p className="text-sm text-muted-foreground mt-1.5">{helperText}</p>
      )}
    </Field>
  );
};

export default InputField;
