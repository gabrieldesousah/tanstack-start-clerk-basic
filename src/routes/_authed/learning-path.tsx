import { createFileRoute } from "@tanstack/react-router";

import { LearningPathPage } from "~/components/pages/LearningPath/LearningPathPage";

export const Route = createFileRoute("/_authed/learning-path")({
  component: LearningPathPage,
});
