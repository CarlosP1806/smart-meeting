import { forwardRef } from "react";

interface IFormInputProps {
  placeholder: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

export const FormInput = forwardRef(
  (
    { placeholder, type, onChange, name }: IFormInputProps,
    ref: React.LegacyRef<HTMLInputElement> | undefined
  ) => {
    return (
      <input
        ref={ref}
        name={name}
        className="mb-4 p-2 focus:outline-none focus:border-solid focus:border-b-2 border-accent"
        type={type}
        placeholder={placeholder}
        onChange={onChange}
      />
    );
  }
);
