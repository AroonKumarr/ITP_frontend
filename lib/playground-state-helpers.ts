// lib/playground-state-helpers.ts
import { PlaygroundState } from "@/hooks/use-playground-state";
import { Preset } from "@/data/presets";

export const playgroundStateHelpers = {
  getSelectedPreset: (state: PlaygroundState): Preset | undefined =>
    state.selectedPresetId
      ? state.presets.find(p => p.id === state.selectedPresetId)
      : undefined,

  getUserPresets: (state: PlaygroundState): Preset[] =>
    state.presets.filter(p => !p.defaultGroup),

  getDefaultPresets: (state: PlaygroundState): Preset[] =>
    state.presets.filter(p => p.defaultGroup),

  encodeToUrlParams: (obj: Record<string, any>): string => {
    const params = new URLSearchParams();
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    return params.toString();
  },
};
