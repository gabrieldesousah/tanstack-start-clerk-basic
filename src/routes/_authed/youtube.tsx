import { createFileRoute } from "@tanstack/react-router";
import { ListYoutubeVideos } from "~/components/pages/ListYoutubeVideos";

export const Route = createFileRoute("/_authed/youtube")({
  component: ListYoutubeVideos,
});
