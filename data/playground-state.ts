// playground-state.ts

import { ModelId } from "./models";
import { TranscriptionModelId } from "./transcription-models";
import { TurnDetectionTypeId } from "./turn-end-types";
import { ModalitiesId } from "./modalities";
import { VoiceId } from "./voices";

/**
 * Session configuration for the AI agent
 */
export interface SessionConfig {
  model: ModelId;
  transcriptionModel: TranscriptionModelId;
  turnDetection: TurnDetectionTypeId;
  modalities: ModalitiesId;
  voice: VoiceId;
  temperature: number;

  maxOutputTokens: number | null;
  vadThreshold: number;
  vadSilenceDurationMs: number;
  vadPrefixPaddingMs: number;
}

/**
 * Complete Playground State
 */
export interface PlaygroundState {
  instructions: string;         // <-- This fixes the CodeViewer.tsx error
  sessionConfig: SessionConfig;
}

/**
 * Default session configuration
 */
export const defaultSessionConfig: SessionConfig = {
  model: ModelId.GPT_4_REALTIME,
  transcriptionModel: TranscriptionModelId.WHISPER_V1,
  turnDetection: TurnDetectionTypeId.SILENCE,
  modalities: ModalitiesId.AUDIO,
  voice: VoiceId.NEUTRAL,
  temperature: 1.0,
  maxOutputTokens: null,
  vadThreshold: 0.5,
  vadSilenceDurationMs: 500,
  vadPrefixPaddingMs: 250,
};

/**
 * Default playground state
 */
export const defaultPlaygroundState: PlaygroundState = {
  instructions: "Hello! This is the default instruction for the AI agent.",
  sessionConfig: defaultSessionConfig,
};
