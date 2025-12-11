


export interface Preset {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  sessionConfig?: any;
  defaultGroup?: boolean;
  createdAt?: number;
  updatedAt?: number;
  icon?: React.ElementType;
}

export enum PresetGroup {
  EXAMPLES = "Examples",
  TEMPLATES = "Templates",
}

export const presets: Preset[] = [];