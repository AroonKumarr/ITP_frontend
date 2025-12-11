export enum ModelId {
  GPT_4_REALTIME = "gpt-4-realtime",
  GPT_3_5_REALTIME = "gpt-3.5-realtime",
}

export const models = [
  {
    id: ModelId.GPT_4_REALTIME,
    label: "GPT-4 Realtime",
  },
  {
    id: ModelId.GPT_3_5_REALTIME,
    label: "GPT-3.5 Realtime",
  },
];