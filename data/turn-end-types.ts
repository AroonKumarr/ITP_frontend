export enum TurnDetectionTypeId {
  SILENCE = "silence",
  INTENT = "intent",
  MANUAL = "manual",
  
  SERVER_VAD = "server_vad",
}
export const turnDetectionTypes = [
  { id: TurnDetectionTypeId.SILENCE, name: "Silence" },
  { id: TurnDetectionTypeId.INTENT, name: "Intent" },
  { id: TurnDetectionTypeId.MANUAL, name: "Manual" },
  { id: TurnDetectionTypeId.SERVER_VAD, name: "Server VAD" }, // add this
] as const;