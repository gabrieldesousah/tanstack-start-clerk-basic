import { createFileRoute } from "@tanstack/react-router";

import { VideosHome } from "~/components/pages/VideosHome";

export const Route = createFileRoute("/_authed/explore")({
  component: VideosHome,
});
