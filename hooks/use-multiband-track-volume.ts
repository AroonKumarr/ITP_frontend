import { useState, useEffect } from "react";
import { Track } from "livekit-client";

const useMultibandTrackVolume = (
  track?: Track,
  bandCount = 8,
  framesPerBand = 1
): number[][] => {
  // array of arrays: each band has 'framesPerBand' samples
  const [bands, setBands] = useState<number[][]>(
    Array.from({ length: bandCount }, () => Array(framesPerBand).fill(0))
  );

  useEffect(() => {
    if (!track) return;

    const interval = setInterval(() => {
      const newBands = Array.from({ length: bandCount }, () =>
        Array(framesPerBand).fill(0).map(() => Math.random())
      );
      setBands(newBands);
    }, 500);

    return () => clearInterval(interval);
  }, [track, bandCount, framesPerBand]);

  return bands; // ✅ now it's number[][]
};

export default useMultibandTrackVolume;
