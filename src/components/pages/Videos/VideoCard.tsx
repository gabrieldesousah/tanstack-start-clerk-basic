import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import { createVideo } from "~/utils/videos";

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

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type Channel = {
  _id?: string;
  externalId: string;
  name: string;
  thumbnails: any;
};

type Video = {
  id?: string;
  name: string;
  externalId: string;
  description: string;
  thumbnails: Thumbnail[] | Record<string, Thumbnail>;
  publishedAt?: Date | string | null;
  duration: number;
  viewCount: string;
  tags?: string[] | null;
  channel?: Channel | null;
  phrasalVerbs?: string[] | null;
  idioms?: string[] | null;
  level?: string | null;
};

export const VideoCard = ({ video }: { video: Video }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSaveOrOpenVideo = async () => {
    setIsLoading(true);
    toast("Salvando vídeo", {
      description: video.name,
    });

    try {
      const thumbnailsArray = Array.isArray(video.thumbnails)
        ? video.thumbnails
        : Object.values(video.thumbnails);

      const result = await createVideo({
        data: {
          name: video.name,
          externalId: video.externalId,
          description: video.description,
          thumbnails: thumbnailsArray,
          publishedAt: video.publishedAt
            ? new Date(video.publishedAt)
            : undefined,
          duration: video.duration,
          viewCount: video.viewCount,
          tags: video.tags ?? undefined,
          channel: video.channel ?? undefined,
          phrasalVerbs: video.phrasalVerbs ?? undefined,
          idioms: video.idioms ?? undefined,
          level: video.level as
            | "A1"
            | "A2"
            | "B1"
            | "B2"
            | "C1"
            | "C2"
            | undefined,
        },
      });

      toast("Opening...", {
        duration: 1000,
      });
      navigate({ to: "/player/$videoId", params: { videoId: result.id } });
    } catch (error) {
      toast("Erro ao salvar o vídeo", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openVideo = () => {
    if (!video.id) {
      return;
    }

    navigate({ to: "/player/$videoId", params: { videoId: video.id } });
  };

  const thumbnailsArray = Array.isArray(video?.thumbnails)
    ? video.thumbnails
    : Object.values(video?.thumbnails || {});

  const highestResolutionThumbnail = thumbnailsArray.reduce(
    (max, current) => (max.width > current.width ? max : current),
    thumbnailsArray[0],
  );

  return (
    <Card
      key={video.externalId}
      className="w-full flex items-center overflow-hidden relative p-0"
    >
      <div className="flex opacity-0 hover:opacity-100 absolute top-0 left-0 w-full h-full bg-black/50 items-center justify-center z-10 cursor-pointer">
        {video.id ? (
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
          <span>{(video.channel as Channel | undefined)?.name}</span>
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
