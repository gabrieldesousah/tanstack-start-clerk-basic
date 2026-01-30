import React from "react";
import YouTube from "react-youtube";

import { CornerUpLeft, CornerUpRight, Pause, Play } from "lucide-react";
import { NotebookText } from "lucide-react";

import { Caption } from "/imports/api/captions/collections";

import { Button } from "~/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";

import { ListCaptions } from "./Captions/ListCaptions";

export function VideoControls({
  videoState,
  rewind,
  forward,
  togglePlay,
  playVideoAt,
  captions,
  currentCaptionIndex,
}: {
  videoState: any;
  rewind: (seconds: number) => void;
  forward: (seconds: number) => void;
  togglePlay: () => void;
  playVideoAt: (time: number) => void;
  captions: Caption[];
  currentCaptionIndex: number;
}) {
  return (
    <div className="flex align-middle justify-center w-full bg-slate-800 p-1 gap-x-4">
      <Button
        className="h-12 w-12 p-3 m-1 bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground rounded-full"
        onClick={togglePlay}
        title="togglePlay"
      >
        {videoState === YouTube.PlayerState.PLAYING ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>
      <Button
        className="h-12 w-12 p-3 m-1 bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground rounded-full"
        onClick={() => rewind(5)}
        title="rewind(5s)"
      >
        <CornerUpLeft className="h-5 w-5" />
      </Button>
      <Button
        className="h-12 w-12 p-3 m-1 bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground rounded-full"
        onClick={() => forward(5)}
        title="forward(5s)"
      >
        <CornerUpRight className="h-5 w-5" />
      </Button>

      <Drawer>
        <DrawerTrigger asChild>
          <Button className="h-12 w-12 p-3 m-1 bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground rounded-full">
            <NotebookText className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-5">
          <ListCaptions
            captions={captions}
            currentCaptionIndex={currentCaptionIndex}
            playVideoAt={playVideoAt}
            className="flex-grow overflow-auto"
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
