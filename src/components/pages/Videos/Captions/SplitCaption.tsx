import React, { useCallback, useState } from "react";
import YouTube from "react-youtube";

import { Caption } from "/imports/api/captions/collections";

import { WordDialogExplanation } from "~/components/Words/WordDialogExplanation";

export const SplitCaption = ({
  caption,
  videoState,
  pauseVideo,
  playVideo,
}: {
  caption: Caption;
  videoState: number;
  pauseVideo: () => void;
  playVideo: () => void;
}) => {
  const [wasPlaying, setWasPlaying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);

      if (open) {
        setWasPlaying(videoState === YouTube.PlayerState.PLAYING);
        pauseVideo();
      } else {
        if (wasPlaying) {
          playVideo();
        }
      }
    },
    [videoState, pauseVideo, playVideo],
  );

  const handleMouseEnter = useCallback(() => {
    if (videoState === YouTube.PlayerState.PLAYING) {
      setWasPlaying(true);
    } else {
      setWasPlaying(false);
    }
    pauseVideo();
  }, [videoState, wasPlaying, pauseVideo]);

  const handleMouseLeave = useCallback(() => {
    if (
      (!isDialogOpen &&
        videoState !== YouTube.PlayerState.PAUSED &&
        videoState !== YouTube.PlayerState.UNSTARTED) ||
      wasPlaying
    ) {
      playVideo();
    }
  }, [videoState, wasPlaying, isDialogOpen, playVideo]);

  if (!caption) return null;

  return (
    <div
      className="flex flex-wrap gap-x-1.5 justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {caption.text
        .toLocaleLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "")
        .split(/ |\n/)
        .map(
          (word, idx) =>
            word && (
              <WordDialogExplanation
                key={idx}
                word={word}
                handleDialogOpenChange={handleDialogOpenChange}
              />
            ),
        )}
    </div>
  );
};
