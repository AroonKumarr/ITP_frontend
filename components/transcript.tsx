import { RefObject, useEffect, useRef, useState } from "react";
import { useAgent } from "@/hooks/use-agent";
import { cn } from "@/lib/utils";

interface TranscriptProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  scrollButtonRef: RefObject<HTMLButtonElement | null>;
}


export function Transcript({ scrollContainerRef, scrollButtonRef }: TranscriptProps) {
  const { displayTranscriptions } = useAgent();
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const calculateDistanceFromBottom = (container: HTMLDivElement) =>
    container.scrollHeight - container.scrollTop - container.clientHeight;

  const handleScrollVisibility = (
    container: HTMLDivElement,
    scrollButton: HTMLButtonElement
  ) => {
    const distanceFromBottom = calculateDistanceFromBottom(container);
    const shouldShowButton = distanceFromBottom > 100;
    setShowScrollButton(shouldShowButton);
    scrollButton.style.display = shouldShowButton ? "flex" : "none";
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const scrollButton = scrollButtonRef.current;
    if (!container || !scrollButton) return;

    const handleScroll = () => handleScrollVisibility(container, scrollButton);
    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [displayTranscriptions]);

  const scrollToBottom = () =>
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const scrollButton = scrollButtonRef.current;
    if (!scrollButton) return;
    scrollButton.addEventListener("click", scrollToBottom);
    return () => scrollButton.removeEventListener("click", scrollToBottom);
  }, []);

  // ✅ Make sure we return JSX
  return (
    <div className="p-4 min-h-[300px] relative">
      {displayTranscriptions.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-300 text-sm">
          Get talking to start the conversation!
        </div>
      ) : (
        <div className="space-y-4">
          {displayTranscriptions.map(
            ({ segment, participant }) =>
              segment.text.trim() !== "" && (
                <div
                  key={segment.id}
                  className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    participant?.isAgent
                      ? "bg-gray-200 text-[#09090B]"
                      : "ml-auto border bg-blue-600 text-white"
                  )}
                >
                  {segment.text.trim()}
                </div>
              )
          )}
          <div ref={transcriptEndRef} />
        </div>
      )}
    </div>
  );
}
