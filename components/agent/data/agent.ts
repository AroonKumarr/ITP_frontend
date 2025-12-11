export type AgentState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
|"connecting"
  | "error";

// Optional: default visualizer settings for each state
export const DefaultAgentStateOptions = {
  idle: {
    label: "Idle",
  },
  listening: {
    label: "Listening",
  },
  thinking: {
    label: "Thinking",
  },
  connecting: {
    label: "connecting",
  },
  speaking: {
    label: "Speaking",
  },
  error: {
    label: "Error",
  },
} as const;
