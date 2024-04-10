import { v1p1beta1 } from "@google-cloud/speech";

type DiarizationResult = {
  speaker: number | null | undefined;
  words: string | null | undefined;
};

export const transcribeAudio = async (
  fileBuffer: Buffer,
  numSpeakers: number
) => {
  const client = new v1p1beta1.SpeechClient();
  const audio = {
    content: fileBuffer.toString("base64"),
  };

  const config = {
    encoding: "LINEAR16" as const,
    languageCode: "en-US",
    enableSpeakerDiarization: true,
    minSpeakerCount: 2,
    maxSpeakerCount: numSpeakers,
    model: "default",
  };

  const request = {
    config: config,
    audio: audio,
  };

  const [response] = await client.recognize(request);
  if (!response.results) throw new Error("Cannot transcribe audio.");
  const transcription = response.results
    .map((result: any) => result.alternatives[0].transcript)
    .join("");

  const result = response.results?.[response.results.length - 1];
  if (!result || !result.alternatives || !result.alternatives[0]?.words) {
    throw new Error("Cannot diarizate audio.");
  }
  const wordsInfo = result.alternatives[0].words;
  const diarization = wordsInfo.map((a) => {
    return { speaker: a.speakerTag, words: a.word };
  });

  const formattedDiarization = formatDiarization(diarization);

  return { transcription, diarization: formattedDiarization };
};

// Receives a diarization word by word
// Returns a diarization formatted as a list of speakers with their corresponding words
export const formatDiarization = (
  diarization: DiarizationResult[]
): DiarizationResult[] => {
  const formattedDiarization = [] as DiarizationResult[];
  let currentSpeakerTag = diarization[0].speaker;
  let currentSpeakerWords: string = "";

  for (let i = 0; i < diarization.length; i++) {
    if (currentSpeakerTag === diarization[i].speaker) {
      currentSpeakerWords += diarization[i].words + " ";
    } else {
      // Give format to string
      currentSpeakerWords = currentSpeakerWords.trim();
      formattedDiarization.push({
        speaker: currentSpeakerTag,
        words: currentSpeakerWords,
      });

      currentSpeakerWords = diarization[i].words + " ";
      currentSpeakerTag = diarization[i].speaker;
    }
  }

  // Add the last speaker
  currentSpeakerWords = currentSpeakerWords.trim();
  formattedDiarization.push({
    speaker: currentSpeakerTag,
    words: currentSpeakerWords,
  });

  return formattedDiarization;
};

// Receives array of audios as .wav format
// Returns a new wav file buffer with the two audios concatenated
export const concatenateAudio = (files: Buffer[]): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      // Extract audio sample rates
      const sampleRate1 = files[0].readUInt32LE(24);

      // Extract audio data (excluding the headers)
      const audioData = files.map((file) => file.slice(44));

      // Combine audio data
      const concatenatedData = Buffer.concat(audioData);

      // Update the header with the new audio data size
      const outputHeader = Buffer.alloc(44);
      outputHeader.write("RIFF", 0);
      outputHeader.writeUInt32LE(concatenatedData.length + 36, 4);
      outputHeader.write("WAVE", 8);
      outputHeader.write("fmt ", 12);
      outputHeader.writeUInt32LE(16, 16);
      outputHeader.writeUInt16LE(1, 20);
      outputHeader.writeUInt16LE(1, 22);
      outputHeader.writeUInt32LE(sampleRate1, 24); // Use sample rate of the first file
      outputHeader.writeUInt32LE(sampleRate1 * 1 * 2, 28);
      outputHeader.writeUInt16LE(1 * 2, 32);
      outputHeader.writeUInt16LE(16, 34);
      outputHeader.write("data", 36);
      outputHeader.writeUInt32LE(concatenatedData.length, 40);

      // Combine header and concatenated audio data
      const outputData = Buffer.concat([outputHeader, concatenatedData]);

      resolve(outputData);
    } catch (error) {
      reject(error);
    }
  });
};
