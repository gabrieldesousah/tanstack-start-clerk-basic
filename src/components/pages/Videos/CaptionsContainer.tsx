import React from "react";

import { Caption } from "/imports/api/captions/collections";

import { SplitCaption } from "./Captions/SplitCaption";

interface CaptionsContainerProps {
  captions: Caption[];
  videoState: number;
  pauseVideo: () => void;
  playVideo: () => void;
  player: any;
  setCurrentCaptionIndex: (index: number) => void;
  currentCaptionIndex: number;
}

export const CaptionsContainer: React.FC<CaptionsContainerProps> = ({
  captions,
  videoState,
  pauseVideo,
  playVideo,
  player,
  setCurrentCaptionIndex,
  currentCaptionIndex,
}) => {
  React.useEffect(() => {
    const updateCaption = () => {
      const preciseTime = (player?.getCurrentTime() || 0) * 1000;

      const newCaptionIndex = captions.findIndex(
        (caption, index) =>
          caption.start <= preciseTime &&
          (preciseTime < caption.start + caption.dur ||
            (captions[index + 1] && preciseTime < captions[index + 1].start)),
      );

      if (newCaptionIndex !== -1) {
        setCurrentCaptionIndex(newCaptionIndex);
      } else {
        setCurrentCaptionIndex(-1);
      }
    };

    // Initial update
    updateCaption();

    // Set up interval for more frequent updates
    const intervalId = setInterval(updateCaption, 300);

    // Clean up interval on component unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [player?.getCurrentTime(), captions, player]);

  return (
    <div className="flex flex-col justify-between w-full bg-slate-100 h-full items-center p-4">
      {currentCaptionIndex !== -1 && (
        <>
          {currentCaptionIndex > 0 ? (
            <div className="text-xl font-medium justify-center text-slate-400">
              <SplitCaption
                caption={captions[currentCaptionIndex - 1]}
                videoState={videoState}
                pauseVideo={pauseVideo}
                playVideo={playVideo}
              />
            </div>
          ) : (
            <div />
          )}
          <div className="text-3xl font-medium justify-center">
            <SplitCaption
              caption={captions[currentCaptionIndex]}
              videoState={videoState}
              pauseVideo={pauseVideo}
              playVideo={playVideo}
            />
          </div>
          <div className="text-xl font-medium justify-center text-slate-400">
            <SplitCaption
              caption={captions[currentCaptionIndex + 1]}
              videoState={videoState}
              pauseVideo={pauseVideo}
              playVideo={playVideo}
            />
          </div>
        </>
      )}
    </div>
  );
};
