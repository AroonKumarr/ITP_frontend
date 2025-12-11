import { createContext, useContext, ReactNode, useState, useEffect } from "react";

// Agent type
export type Agent = {
  id: string;
  name: string;
  connected: boolean;
};

// Transcription types
export type TranscriptionSegment = {
  id: string;
  text: string;
};

export type Participant = {
  isAgent?: boolean;
};

export type DisplayTranscription = {
  segment: TranscriptionSegment;
  participant?: Participant;
};

// Context type
type AgentContextType = {
  agent: Agent | null;
  displayTranscriptions: DisplayTranscription[];
};

const defaultValue: AgentContextType = {
  agent: null,
  displayTranscriptions: [],
};

export const AgentContext = createContext<AgentContextType>(defaultValue);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [displayTranscriptions, setDisplayTranscriptions] = useState<DisplayTranscription[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAgent({
        id: "agent-1",
        name: "Assistant",
        connected: true,
      });

      // Example: initial transcription (optional)
      setDisplayTranscriptions([
        {
          segment: { id: "1", text: "Hello! How can I help you today?" },
          participant: { isAgent: true },
        },
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const value: AgentContextType = { agent, displayTranscriptions };

  // FIX: React 19 allows using the Context object directly as a provider.
  // Removed .Provider to fix the "Cannot find namespace" error.
  return <AgentContext value={value}>{children}</AgentContext>;
};

// Hook to access agent context
export const useAgent = () => {
  return useContext(AgentContext);
};