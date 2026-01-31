import { createFileRoute } from "@tanstack/react-router";

import { WordReviewCard } from "~/components/fragments/Words/WordReviewCard";

export const Route = createFileRoute("/_authed/review")({
  component: WordReviewCard,
});
