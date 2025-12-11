import { useReducer, useState } from "react";
import {
  PlaygroundState as BasePlaygroundState,
  defaultPlaygroundState,
  SessionConfig,
} from "@/data/playground-state";
import { Preset, presets } from "@/data/presets";

// Extend PlaygroundState to include API key and selectedPresetId
export interface PlaygroundState extends BasePlaygroundState {
  openaiAPIKey: string | null;
  presets: Preset[];
  
  selectedPresetId: string | null;
}

// Actions
type Action =
  | { type: "SET_INSTRUCTIONS"; payload: string }
  | { type: "SET_SESSION_CONFIG"; payload: SessionConfig }
  | { type: "SET_API_KEY"; payload: string | null }
  | { type: "SAVE_USER_PRESET"; payload: Preset }
  
  | { type: "SET_SELECTED_PRESET_ID"; payload: string | null }
  | { type: "DELETE_USER_PRESET"; payload: string };

// Reducer
function reducer(state: PlaygroundState, action: Action): PlaygroundState {
  switch (action.type) {
    case "SET_INSTRUCTIONS":
      return { ...state, instructions: action.payload };
    case "SET_SESSION_CONFIG":
      return { ...state, sessionConfig: action.payload };
    case "SET_API_KEY":
      return { ...state, openaiAPIKey: action.payload };
    case "SAVE_USER_PRESET":
      return {
        ...state,
        presets: [...state.presets.filter(p => p.id !== action.payload.id), action.payload],
      };
    case "SET_SELECTED_PRESET_ID":
      return { ...state, selectedPresetId: action.payload };
    default:
      return state;
  }
}

// Hook
export function usePlaygroundState() {
  const [pgState, dispatch] = useReducer(reducer, {
    ...defaultPlaygroundState,
    openaiAPIKey: null,
    presets: presets,
    selectedPresetId: null,
  });

  const [showAuthDialog, setShowAuthDialog] = useState(true);

 const helpers = {
  getSelectedPreset: (state: PlaygroundState) =>
    state.selectedPresetId
      ? state.presets.find((p) => p.id === state.selectedPresetId)
      : undefined,

  getUserPresets: (state: PlaygroundState) =>
    state.presets.filter((preset) => !preset.defaultGroup),


  getDefaultPresets: (state: PlaygroundState) =>
    state.presets.filter(p => p.defaultGroup),

  encodeToUrlParams: (obj: Record<string, any>) => {
    const params = new URLSearchParams();
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
      
    });
    return params.toString();
  },
};



return {
  pgState,
  dispatch,
  showAuthDialog,
  setShowAuthDialog,
  helpers, // now includes getSelectedPreset + encodeToUrlParams

}
};
