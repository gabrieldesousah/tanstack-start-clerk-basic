import React, { useEffect, useRef } from "react";

import { CirclePlay } from "lucide-react";

import { Caption } from "/imports/api/captions/collections";

import { cn } from "~/lib/utils";";
import { ScrollArea } from "~/components/ui/scroll-area";

export const ListCaptions = ({
  captions,
  currentCaptionIndex,
  playVideoAt,
  className,
}: {
  captions: Caption[];
  currentCaptionIndex: number;
  playVideoAt: (time: number) => void;
  className?: string;
}) => {
  const transcriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentCaptionIndex !== -1 && transcriptionRef.current) {
      const captionElement = transcriptionRef.current.querySelector(
        `[data-start="${captions[currentCaptionIndex]?.start}"]`,
      );
      if (captionElement) {
        captionElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [currentCaptionIndex, captions]);
  const handleTime = (miliseconds: number): string => {
    const time = miliseconds / 1000;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <ScrollArea className={cn(`h-96 p-4`, className)}>
      <div className="text-xl font-medium">Transcription</div>
      <div ref={transcriptionRef}>
        {captions.map((caption, idx) => (
          <div
            key={idx}
            className={`flex text-lg hover:bg-muted px-5 py-2 items-center ${
              currentCaptionIndex === idx ? "bg-muted" : ""
            }`}
            data-start={caption.start}
          >
            <CirclePlay
              className="h-6 w-6 cursor-pointer"
              onClick={() => playVideoAt(caption.start / 1000)}
            />
            <div className="badge badge-lg mx-2">
              {handleTime(caption.start)}
            </div>
            <p className="hover:underline cursor-pointer">{caption.text}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
