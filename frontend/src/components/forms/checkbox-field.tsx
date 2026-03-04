import React from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: React.ReactNode;
  error?: string;
}

const CheckboxField = <T extends FieldValues>({
  name,
  control,
  label,
  error,
}: CheckboxFieldProps<T>) => {
  return (
    <div>
      <div className="flex items-center">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              className="mr-2"
            />
          )}
        />
        {label && (
          <label htmlFor={name} className="text-gray-600">
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
    </div>
  );
};

export default CheckboxField;
