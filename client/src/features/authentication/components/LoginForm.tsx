import { FormEvent, useRef } from "react";
import { FormInput } from "../../../components/FormInput";
import { useAuth } from "../hooks/useAuth";

interface ISignupFormProps {
  onChangeView: () => void;
}

export const LoginForm = ({ onChangeView }: ISignupFormProps) => {
  const { login } = useAuth();

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (username && password) {
      await login(username, password);
    }
  };

  return (
    <section className="flex flex-col bg-white w-5/6 mx-auto max-w-[30rem] p-8 rounded-lg shadow-md">
      <h2 className="text-center mb-12 text-2xl">Log in to your account</h2>
      <form className="flex flex-col">
        <FormInput type="text" placeholder="Username" ref={usernameRef} />
        <FormInput type="password" placeholder="Password" ref={passwordRef} />
        <button
          className="bg-accent text-white py-3 rounded-lg mt-4 hover:opacity-80 transition-all ease-linear"
          onClick={onSubmit}
        >
          Log in
        </button>
      </form>
      <p className="mt-8 text-font italic">
        Don't have an account?{" "}
        <span
          className="text-accent text-b font-bold cursor-pointer"
          onClick={onChangeView}
        >
          Register
        </span>
      </p>
    </section>
  );
};
