export enum ModalitiesId {
  AUDIO = "audio",
  TEXT = "text",
  TEXT_AND_AUDIO = "text_and_audio",
}

// UI-friendly list for rendering in components
export const modalities = [
  {
    id: ModalitiesId.AUDIO,
    label: "Audio",
  },
  {
    id: ModalitiesId.TEXT,
    label: "Text",
  },
  {
    id: ModalitiesId.TEXT_AND_AUDIO,
    label: "Text + Audio",
  },
];
