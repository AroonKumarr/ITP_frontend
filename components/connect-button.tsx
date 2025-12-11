// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { useConnection } from "@/hooks/use-connection";
// import { Loader2, Mic } from "lucide-react";
// import { usePlaygroundState } from "@/hooks/use-playground-state";
// import { AuthDialog } from "./auth";
// import { useRef } from "react";
// import { ChevronDown } from "lucide-react";
// import clsx from "clsx";

// export function ConnectButton() {
//   const { connect, disconnect, shouldConnect } = useConnection();
//   const [connecting, setConnecting] = useState<boolean>(false);
//   const { pgState } = usePlaygroundState();
//   const [showAuthDialog, setShowAuthDialog] = useState(false);
//   const [initiateConnectionFlag, setInitiateConnectionFlag] = useState(false);

//   const handleConnectionToggle = async () => {
//     if (shouldConnect) {
//       await disconnect();
//     } else {
//       if (!pgState.openaiAPIKey) {
//         setShowAuthDialog(true);
//       } else {
//         await initiateConnection();
//       }
//     }
//   };

//   const initiateConnection = useCallback(async () => {
//     setConnecting(true);
//     try {
//       await connect();
//     } catch (error) {
//       console.error("Connection failed:", error);
//     } finally {
//       setConnecting(false);
//     }
//   }, [connect]);

//   const handleAuthComplete = () => {
//     setShowAuthDialog(false);
//     setInitiateConnectionFlag(true);
//   };

//   // useEffect(() => {
//   //   if (initiateConnectionFlag && pgState.openaiAPIKey) {
//   //     initiateConnection();
//   //     setInitiateConnectionFlag(false);
//   //   }
//   // }, [initiateConnectionFlag, initiateConnection, pgState.openaiAPIKey]);

//   const [isActive, setIsActive] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);

//   const toggleActive = () => setIsActive(!isActive);
//   const toggleMute = () => {
//     // e.stopPropagation();
//     setIsMuted(!isMuted);
//   };

//   return (
//     <>
//       <Button
//         onClick={handleConnectionToggle}
//         disabled={connecting || shouldConnect}
//         className=""
//       >
//         <div
//           onClick={toggleActive}
//           className={clsx(
//             "relative cursor-pointer transition-transform duration-300 ease-in-out",
//             "rounded-full",
//             "grid place-items-center",
//             "w-[32rem] h-[32rem] max-w-[60vmin] max-h-[60vmin]",
//             "bg-black",
//             {
//               active: isActive,
//               muted: isMuted,
//             }
//           )}
//         >
//           {/* Orb Core */}
//           <div
//             className={clsx(
//               "absolute inset-0 rounded-full blur-md",
//               "bg-[conic-gradient(var(--tw-gradient-stops))]",
//               isActive ? "animate-core-pulse" : ""
//             )}
//             style={{
//               backgroundImage: `radial-gradient(circle at 50% 50%, #000 20%, transparent 50%),
//                      conic-gradient(${isActive ? "var(--tw-activePrimary)" : "var(--tw-primary)"} 70%, ${isActive ? "var(--tw-activeSecondary)" : "var(--tw-secondary)"})`,
//             }}
//           />

//           {/* Light Rays */}
//           <div
//             className={clsx(
//               "absolute inset-0",
//               "rounded-full",
//               "blur-3xl",
//               "bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.2)_0%,rgba(0,191,255,0)_70%)]",
//               isActive ? "animate-light-pulse" : ""
//             )}
//           />

//           {/* Slices */}
//           <div className="absolute inset-0 rounded-full overflow-hidden">
//             {[...Array(5)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute inset-0 rounded-full bg-white/10 animate-wave-slice"
//                 style={{ animationDelay: `${i * 0.3}s` }}
//               />
//             ))}
//           </div>

//           {/* Particles & Layers (optional extras for effect) */}
//           <div className="absolute inset-0">
//             <div className="absolute w-2 h-2 bg-white/20 rounded-full top-[10%] left-[70%] animate-ping" />
//             <div className="absolute w-2 h-2 bg-white/20 rounded-full top-[30%] left-[20%] animate-ping delay-[2s]" />
//             <div className="absolute w-2 h-2 bg-white/20 rounded-full top-[60%] left-[80%] animate-ping delay-[4s]" />
//             <div className="absolute w-2 h-2 bg-white/20 rounded-full top-[80%] left-[40%] animate-ping delay-[6s]" />
//           </div>

//           {/* Controls */}
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10">
//             <button className="px-6 py-3 mb-8 max-w-[100%] bg-black/20 backdrop-blur-md text-white rounded-full text-lg hover:bg-black/30 transition-transform">
//               {isActive ? "Connecting" : "Talk to Lemi"}
//             </button>
//             {/* <button
//                         onClick={toggleMute}
//                         className={clsx(
//                           'w-14 h-14 rounded-full text-2xl flex items-center justify-center',
//                           'bg-black/20 text-white hover:bg-black/30 transition-transform backdrop-blur-md',
//                           isMuted && 'bg-red-500/20'
//                         )}
//                       >
//                         {isMuted ? '🔇' : '🔊'}
//                       </button> */}
//           </div>
//         </div>

//         {/* {connecting || shouldConnect ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Connecting
//           </>
//         ) : (
//           <>
//             <Mic className="mr-2 h-4 w-4" />
//             Talk to Lemi
//           </>
//         )} */}
//       </Button>
//       <AuthDialog
//         open={showAuthDialog}
//         onOpenChange={setShowAuthDialog}
//         onAuthComplete={handleAuthComplete}
//       />
//     </>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useConnection } from "@/hooks/use-connection";
import { Loader2, Mic } from "lucide-react";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { AuthDialog } from "./auth";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export function ConnectButton() {
  const { connect, disconnect, shouldConnect } = useConnection();
  const [connecting, setConnecting] = useState<boolean>(false);
  const { pgState } = usePlaygroundState();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [initiateConnectionFlag, setInitiateConnectionFlag] = useState(false);

  const handleConnectionToggle = async () => {
    if (shouldConnect) {
      await disconnect();
    } else {
      if (!pgState.openaiAPIKey) {
        setShowAuthDialog(true);
      } else {
        await initiateConnection();
      }
    }
  };

  const initiateConnection = useCallback(async () => {
    setConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setConnecting(false);
    }
  }, [connect]);

  const handleAuthComplete = () => {
    setShowAuthDialog(false);
    setInitiateConnectionFlag(true);
  };

  // useEffect(() => {
  //   if (initiateConnectionFlag && pgState.openaiAPIKey) {
  //     initiateConnection();
  //     setInitiateConnectionFlag(false);
  //   }
  // }, [initiateConnectionFlag, initiateConnection, pgState.openaiAPIKey]);

  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleActive = () => setIsActive(!isActive);
  const toggleMute = () => {
    // e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <>
      <button
        onClick={handleConnectionToggle}
        disabled={connecting || shouldConnect}
        className={clsx(
          "relative cursor-pointer transition-transform duration-300 ease-in-out",
          "rounded-full grid place-items-center",
          "w-[32rem] h-[32rem] max-w-[60vmin] max-h-[60vmin]",
          "overflow-hidden border-none outline-none focus:outline-none"
        )}
        style={{ padding: 0 }}
        type="button"
      >
        {/* Video as button background */}
        <video
          className="absolute inset-0 w-full h-full object-cover rounded-full"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="orb.mp4" type="video/mp4" />
        </video>
        {/* Button text overlay */}
        <span className="relative z-10 text-white text-2xl font-semibold pointer-events-none select-none">
          {isActive ? "Connecting" : "Talk to Lemi"}
        </span>
      </button>

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthComplete={handleAuthComplete}
      />
    </>
  );
}
