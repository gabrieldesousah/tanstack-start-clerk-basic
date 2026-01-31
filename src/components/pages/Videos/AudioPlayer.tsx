import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Loader2Icon, Pause, Play } from "lucide-react";

import { getVideoById } from "~/utils/videos";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { LoaderSpinner } from "~/components/ui/loader";

import { VideoPlayer } from "./VideoPlayer";

export const AudioPlayer = ({
  videoId,
  start,
  end,
  className,
}: {
  videoId: string;
  start: number;
  end: number;
  className?: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [player, setPlayer] = useState<any>(null);
  const [videoReady, setVideoReady] = useState(false);

  const playVideoAt = (time: number) => {
    if (player) {
      player.seekTo(time, true);
      player.playVideo();
    }
  };

  const { data: video, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoById({ data: videoId }),
    enabled: !!videoId,
  });

  useEffect(() => {
    const isFinished = () => {
      const preciseTime = (player?.getCurrentTime() || 0) * 1000;

      if (preciseTime >= end) {
        setIsPlaying(false);
        player.seekTo(start / 1000, true);
        player.pauseVideo();
      }
    };
    const intervalId = setInterval(isFinished, 300);

    return () => clearInterval(intervalId);
  }, [isPlaying, end, player, start]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <>
      {videoReady ? (
        <Button
          onClick={() => playVideoAt(start / 1000)}
          className={cn(
            "rounded-full w-6 h-6 items-center justify-center p-0",
            className,
          )}
        >
          {isPlaying ? (
            <Pause className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3" />
          )}
        </Button>
      ) : (
        <Button
          onClick={() => playVideoAt(start / 1000)}
          className={cn(
            "rounded-full w-6 h-6 items-center justify-center p-0",
            className,
          )}
        >
          <Loader2Icon className="w-3 h-3 animate-spin" />
        </Button>
      )}
      <div style={{ display: "none" }}>
        <VideoPlayer
          externalVideoId={video?.externalId || ""}
          allowControls={false}
          setPlayer={setPlayer}
          setVideoReady={setVideoReady}
        />
      </div>
    </>
  );
};
