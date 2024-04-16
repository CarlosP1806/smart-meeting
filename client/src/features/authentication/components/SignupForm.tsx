import { FormInput } from "../../../components/FormInput";

interface ISignupFormProps {
  onChangeView: () => void;
}

export const SignupForm = ({ onChangeView }: ISignupFormProps) => {
  return (
    <section className="flex flex-col bg-white w-5/6 mx-auto max-w-[30rem] p-8 rounded-lg shadow-md">
      <h2 className="text-center mb-12 text-2xl">Create an Account</h2>
      <form className="flex flex-col">
        <FormInput type="text" placeholder="Username" />
        <FormInput type="mail" placeholder="Mail" />
        <FormInput type="password" placeholder="Password" />
        <FormInput type="password" placeholder="Confirm password" />
        <button className="bg-accent text-white py-3 rounded-lg mt-4 hover:opacity-80 transition-all ease-linear">
          Submit
        </button>
      </form>
      <p className="mt-8 text-font italic">
        Already have an account?{" "}
        <span
          className="text-accent text-b font-bold cursor-pointer"
          onClick={onChangeView}
        >
          Log in
        </span>
      </p>
    </section>
  );
};
