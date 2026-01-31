import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import YouTube from "react-youtube";

import { useQuery } from "@tanstack/react-query";

import { getVideoById } from "~/utils/videos";
import { getCaptionsByVideoId } from "~/utils/captions";

import { LoaderSpinner } from "~/components/ui/loader";

import { CaptionsContainer } from "./CaptionsContainer";
import { VideoControls } from "./VideoControls";
import { VideoPlayer } from "./VideoPlayer";

export const VideoPage: React.FC = () => {
  const { videoId } = useParams({ strict: false });

  const [player, setPlayer] = useState<any>(null);
  const [videoState, setVideoState] = useState(-1);
  const [videoReady, setVideoReady] = useState(false);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(-1);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const { data: video, isLoading: isLoadingVideo } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => getVideoById({ data: videoId! }),
    enabled: !!videoId,
  });

  const { data: captions = [], isLoading: isLoadingCaptions } = useQuery({
    queryKey: ["captions", videoId],
    queryFn: () => getCaptionsByVideoId({ data: videoId! }),
    enabled: !!videoId,
  });

  const playVideoAt = (time: number) => {
    if (player) {
      player.seekTo(time, true);
      player.playVideo();
    }
  };

  const pauseVideo = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  const playVideo = () => {
    if (player) {
      player.playVideo();
    }
  };

  const rewind = (seconds: number) => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime - seconds, true);
    }
  };

  const forward = (seconds: number) => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime + seconds, true);
    }
  };

  const togglePlay = () => {
    if (player) {
      if (videoState === YouTube.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleVideoEnded = () => {
    setIsVideoEnded(true);
    console.log("isVideoEnded", isVideoEnded);
  };

  const isLoading = isLoadingVideo || isLoadingCaptions;

  return (
    <div className="flex flex-col grow h-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoaderSpinner />
        </div>
      ) : (
        <>
          <div className="flex-none align-middle justify-center bg-black relative w-full max-h-1/2">
            {!videoReady && (
              <div className="absolute top-0 left-0 w-full h-full bg-black text-white flex items-center justify-center">
                <LoaderSpinner />
              </div>
            )}
            <VideoPlayer
              externalVideoId={video?.externalId}
              setPlayer={setPlayer}
              setVideoReady={setVideoReady}
              setVideoState={setVideoState}
              togglePlay={togglePlay}
              onEnd={handleVideoEnded}
            />
          </div>
          <VideoControls
            videoState={videoState}
            rewind={rewind}
            forward={forward}
            togglePlay={togglePlay}
            captions={captions}
            currentCaptionIndex={currentCaptionIndex}
            playVideoAt={playVideoAt}
          />
          <CaptionsContainer
            captions={captions}
            videoState={videoState}
            pauseVideo={pauseVideo}
            playVideo={playVideo}
            player={player}
            setCurrentCaptionIndex={setCurrentCaptionIndex}
            currentCaptionIndex={currentCaptionIndex}
          />
        </>
      )}
    </div>
  );
};
