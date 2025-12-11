





"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";
import { useState } from 'react';
import { ConfigurationForm } from "@/components/configuration-form";
import { Chat } from "@/components/chat";
import { Transcript } from "@/components/transcript";
import { useConnection } from "@/hooks/use-connection";
import { AgentProvider } from "@/hooks/use-agent";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import clsx from 'clsx';

export function RoomComponent() {
  const { shouldConnect, wsUrl, token } = useConnection();
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleActive = () => setIsActive(!isActive);
  const toggleMute = () => {
    // e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    // <></>

    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={shouldConnect}
      audio={true}
      className="flex flex-col md:grid md:grid-cols-[1fr_360px] lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[360px_1fr_360px] flex-grow overflow-hidden border-r border-b rounded-b-md border-black"
      style={{ "--lk-bg": "black" } as React.CSSProperties}
    >
      <AgentProvider>
        <div className="">
          

          <div className="flex flex-col justify-center w-full max-w-3xl mx-auto">
            <Chat />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              ref={scrollButtonRef}
              className="p-2 bg-white text-gray-500 rounded-full hover:bg-gray-100 transition-colors absolute right-4 bottom-4 shadow-md flex items-center"
            >
              {/* <ChevronDown className="mr-1 h-4 w-4" /> */}
            </button>
          </div>
        </div>
        <RoomAudioRenderer />
        <StartAudio label="Click to allow audio playback" />
      </AgentProvider>
    </LiveKitRoom>
  );
}
