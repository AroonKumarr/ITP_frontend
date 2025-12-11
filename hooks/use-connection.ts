import { useCallback, useState } from "react";

export function useConnection() {
  const [isConnected, setIsConnected] = useState(false);

  const disconnect = useCallback(() => {
    console.log("Disconnected from the session.");
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    console.log("Connected to the session.");
    setIsConnected(true);
  }, []);

  const shouldConnect = !isConnected;

  // Example LiveKit config (replace with your real values)
  const token = "YOUR_LIVEKIT_TOKEN";
  const wsUrl = "wss://your.livekit.server";

  return { disconnect, connect, shouldConnect, wsUrl, token };
}
