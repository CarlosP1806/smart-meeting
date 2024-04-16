import { forwardRef } from "react";

interface IFormInputProps {
  placeholder: string;
  type: string;
}

export const FormInput = forwardRef(
  (
    { placeholder, type }: IFormInputProps,
    ref: React.LegacyRef<HTMLInputElement> | undefined
  ) => {
    return (
      <input
        ref={ref}
        className="mb-4 p-2 focus:outline-none focus:border-solid focus:border-b-2 border-accent"
        type={type}
        placeholder={placeholder}
      />
    );
  }
);
