import React, { useEffect, useState } from "react";

import { useFind, useSubscribe } from "meteor/react-meteor-data";

import { Pause, Play } from "lucide-react";

import { Video, VideosCollection } from "/imports/api/videos/collections";

import { cn } from "~/lib/utils";";
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

  const isLoading = useSubscribe("videos.list");
  const [video]: Video[] = useFind(
    () => VideosCollection.find({ _id: videoId }),
    [videoId],
  );

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
  }, [isPlaying, end, player]);

  return isLoading() ? (
    <div className="flex justify-center items-center h-full w-full">
      <LoaderSpinner />
    </div>
  ) : (
    <>
      <Button
        onClick={() => playVideoAt(start / 1000)}
        className={cn(
          "rounded-full w-6 h-6 items-center justify-center p-0",
          className,
        )}
        isLoading={!videoReady}
      >
        {isPlaying ? (
          <Pause className="w-3 h-3" />
        ) : (
          <Play className="w-3 h-3" />
        )}
      </Button>

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
