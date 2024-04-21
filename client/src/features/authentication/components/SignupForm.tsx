import { FormInput } from "../../../components/FormInput";
import {
  IMediaRecorder,
  MediaRecorder,
  register,
} from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";
import { useEffect, useRef, useState } from "react";
import { signup } from "../services/auth.service";

interface ISignupFormProps {
  onChangeView: () => void;
}

export const SignupForm = ({ onChangeView }: ISignupFormProps) => {
  const [formData, setFormData] = useState({
    username: "",
    mail: "",
    password: "",
    confirmPassword: "",
  });
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audio, setAudio] = useState<string | null>(null);

  useEffect(() => {
    if (!audioBlob) return;
    const audioURL = URL.createObjectURL(audioBlob);
    setAudio(audioURL);
  }, [audioBlob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, mail, password } = formData;
    const form = new FormData();
    form.append("username", username);
    form.append("email", mail);
    form.append("password", password);
    form.append("file", audioBlob as Blob, "reference.wav");

    await signup(form);
  };

  return (
    <section className="flex flex-col bg-white w-5/6 mx-auto max-w-[30rem] p-8 rounded-lg shadow-md">
      <h2 className="text-center mb-12 text-2xl">Create an Account</h2>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <FormInput
          type="text"
          placeholder="Username"
          onChange={handleChange}
          name="username"
        />
        <FormInput
          type="mail"
          placeholder="Mail"
          onChange={handleChange}
          name="mail"
        />
        <FormInput
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        <FormInput
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          onChange={handleChange}
        />
        <p className="text-font">
          Please upload a sample recording of your voice saying the following
          phrase: "Hello, my name is [your name] and I am creating an account."
        </p>
        <div className="flex align-middle justify-center mt-4 gap-4">
          <RecordInput setAudioBlob={setAudioBlob} />
          {audio && <audio src={audio} controls />}
        </div>
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

interface IRecordInputProps {
  setAudioBlob: (blob: Blob) => void;
}

export const RecordInput = ({ setAudioBlob }: IRecordInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<IMediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const enableStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    await register(await connect());
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "audio/wav",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, {
        type: "audio/wav",
      });
      setAudioBlob(blob);
      audioChunksRef.current = [];
    };
  };

  useEffect(() => {
    enableStream();
  }, []);

  const startRecording = () => {
    if (!mediaRecorderRef.current) return;
    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <>
      <div className="bg-red-400 rounded-full size-16 p-4 cursor-pointer">
        {!isRecording ? (
          <img src="/images/record-button.png" onClick={startRecording} />
        ) : (
          <img src="/images/stop-button.png" onClick={stopRecording} />
        )}
      </div>
    </>
  );
};
