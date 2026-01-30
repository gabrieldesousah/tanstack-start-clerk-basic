import React, { useState } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";

import { useFind, useSubscribe } from "meteor/react-meteor-data";

import { CaptionsCollection } from "/imports/api/captions/collections";
import { VideosCollection } from "/imports/api/videos/collections";

import { LoaderSpinner } from "~/components/ui/loader";

import { CaptionsContainer } from "./CaptionsContainer";
import { VideoControls } from "./VideoControls";
import { VideoPlayer } from "./VideoPlayer";

export const VideoPage: React.FC = () => {
  const { videoId } = useParams();
  console.log("videoId", videoId);

  const [player, setPlayer] = useState<any>(null);
  const [videoState, setVideoState] = useState(-1);
  const [videoReady, setVideoReady] = useState(false);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(-1);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const isLoadingVideo = useSubscribe("videos.findById", videoId);
  const [video] = useFind(
    () => VideosCollection.find({ _id: videoId }),
    [videoId],
  );

  const isLoadingCaptions = useSubscribe("youtube.captions", videoId);
  const captions = useFind(
    () => CaptionsCollection.find({ videoId: videoId }, { sort: { start: 1 } }),
    [videoId],
  );

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

  return (
    <div className="flex flex-col flex-grow h-full">
      {isLoadingVideo() || isLoadingCaptions() ? (
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
