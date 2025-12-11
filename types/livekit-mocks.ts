export class MultimodalAgent {
  constructor(config: any) {}
  async start(room: any) {
    console.log("Agent started", room);
  }
}

export class RealtimeModel {
  constructor(config: any) {}
}

export class ServerVadOptions {
  constructor(config: any) {}
}

export const multimodal = { MultimodalAgent };
export const openai = { realtime: { RealtimeModel, ServerVadOptions } };
