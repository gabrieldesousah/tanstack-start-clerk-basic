import React from "react";
import YouTube from "react-youtube";

import { cn } from "~/lib/utils";";

type VideoPlayerProps = {
  externalVideoId: string;
  setPlayer?: (player: any) => void;
  setVideoReady?: (ready: boolean) => void;
  setVideoState?: (state: number) => void;
  allowControls?: boolean;
  togglePlay?: () => void;
  className?: string;
  onEnd?: () => void;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  externalVideoId,
  setPlayer,
  setVideoReady,
  setVideoState,
  togglePlay,
  allowControls = false,
  className,
  onEnd,
}: VideoPlayerProps) => {
  const onReady = (event: { target: any }) => {
    setPlayer?.(event.target);
    setVideoReady?.(true);
  };

  const onStateChange = (event: { data: number }) => {
    setVideoState?.(event.data);
  };

  return (
    <div
      className={cn(
        `flex flex-col justify-center align-middle w-full relative h-60 lg:h-96 md:h-0 md:pb-[46.25%] lg:pb-[36.25%]`,
        className,
      )}
    >
      {!allowControls && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-slate-500 z-10 opacity-0 hover:opacity-10 cursor-pointer"
          onClick={togglePlay}
        ></div>
      )}
      <YouTube
        videoId={externalVideoId}
        onReady={onReady}
        onStateChange={onStateChange}
        onEnd={onEnd}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            controls: allowControls ? 1 : 0,
            modestbranding: 1,
            rel: 0,
            loop: 1,
            disablekb: 0,
            fs: 1,
            cc_lang_pref: false,
            cc_load_policy: 3, //hidden captions
            iv_load_policy: 3, //hidden videos player
          },
        }}
        className="absolute top-0 left-0 w-full h-full max-h-1/2"
      />
    </div>
  );
};
