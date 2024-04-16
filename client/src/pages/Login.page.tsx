import { useState } from "react";
import { SignupForm, LoginForm } from "../features/authentication";

const LoginPage = () => {
  const [currentView, setCurrentView] = useState("login");

  return (
    <div className="flex-1 flex">
      <aside className="hidden md:flex bg-primary flex-1 justify-center items-center">
        <article className="w-4/5">
          <h1 className="text-gray-200 text-5xl mb-8">
            Welcome to Smart Meet!
          </h1>
          <p className="text-gray-200 text-xl">
            Your online AI-Powered assistant to become more productive at
            meetings.
          </p>
        </article>
      </aside>
      <div className="flex-1 flex flex-col justify-center items-center md:flex-row">
        {currentView === "login" ? (
          <LoginForm onChangeView={() => setCurrentView("sigunp")} />
        ) : (
          <SignupForm onChangeView={() => setCurrentView("login")} />
        )}
      </div>
    </div>
  );
};

export const LoginRoute = {
  element: <LoginPage />,
};
