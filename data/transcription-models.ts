export enum TranscriptionModelId {
  WHISPER_V1 = "whisper_v1",
  WHISPER_SMALL = "whisper_small",
}


// Create an array for mapping in Select
export const transcriptionModels = [
  { id: TranscriptionModelId.WHISPER_V1, name: "Whisper v1" },
  { id: TranscriptionModelId.WHISPER_SMALL, name: "Whisper Small" },
] as const;