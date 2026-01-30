import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Meteor } from "meteor/meteor";

import { Loader2 } from "lucide-react";

import { Video } from "/imports/api/videos/collections";

import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { getDurationFormatted } from "~/lib/videos";
import { VideoPlayer } from "./VideoPlayer";

export const VideoCard = ({ video }: { video: Video }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSaveOrOpenVideo = () => {
    setIsLoading(true);
    toast("Salvando vídeo", {
      description: video.name,
    });
    Meteor.call(
      "youtube.getVideo",
      { externalVideoId: video.externalId },
      (error: Error, result: Video) => {
        setIsLoading(false);

        if (error || !result) {
          toast("Erro ao salvar o vídeo", {
            description: error?.message,
          });
          console.error(error);
          return;
        }

        toast("Opening...", {
          duration: 1000,
        });
        navigate(`/player/${result._id}`);
      },
    );
  };

  const openVideo = () => {
    if (!video._id) {
      return;
    }

    navigate(`/player/${video._id}`);
  };

  const highestResolutionThumbnail = Object.values(video?.thumbnails).reduce(
    (max, current) => (max.width > current.width ? max : current),
  );

  return (
    <Card
      key={video.externalId}
      className="w-full flex items-center overflow-hidden relative p-0"
    >
      <div className="flex opacity-0 hover:opacity-100 absolute top-0 left-0 w-full h-full bg-black/50 items-center justify-center z-10 cursor-pointer">
        {video._id ? (
          <Button variant="secondary" onClick={openVideo}>
            Estudar conteúdo!
          </Button>
        ) : isLoading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Visualizar conteúdo!</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-full lg:max-w-3xl">
              <DialogHeader>
                <DialogTitle>{video.name}</DialogTitle>
              </DialogHeader>
              <VideoPlayer
                externalVideoId={video.externalId}
                allowControls={true}
                className="lg:pb-[80%]"
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button variant="secondary" onClick={handleSaveOrOpenVideo}>
                  Estudar conteúdo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <CardHeader className="p-0 flex-none w-full h-full">
        {highestResolutionThumbnail && (
          <img
            src={highestResolutionThumbnail?.url}
            alt={video.name}
            className="w-full h-96 object-cover"
          />
        )}
      </CardHeader>
      <CardContent className="absolute bottom-0 p-5 bg-primary/80 text-white justify-between w-full flex-auto h-48">
        <CardTitle className="text-left">{video.name}</CardTitle>
        <CardDescription className="justify-center lg:justify-between text-left flex flex-col  text-white">
          <span>{video.channel?.name}</span>
          <span>{getDurationFormatted(video.duration)}</span>
          <span>
            {video?.publishedAt instanceof Date
              ? video.publishedAt.toISOString()
              : video?.publishedAt}
          </span>
          <span className="text-sm max-h-16 line-clamp-3">
            {video.description}
          </span>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
