import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { WordReviewCard } from "~/components/Words/WordReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { RoutePaths } from "../routes/RoutePaths";
import { LearningPathPage } from "./LearningPath/LearningPathPage";
import { VideosHome } from "./VideosHome";

export const Home = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [tabValue, setTabValue] = useState<RoutePaths>(RoutePaths.EXPLORE);

  useEffect(() => {
    const newTabValue = pathname.includes(RoutePaths.LEARNING_PATH)
      ? RoutePaths.LEARNING_PATH
      : pathname.includes(RoutePaths.MEMORY_CARDS)
        ? RoutePaths.MEMORY_CARDS
        : RoutePaths.EXPLORE;
    setTabValue(newTabValue);
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setTabValue(value as RoutePaths);
    navigate(value);
  };

  return (
    <div className="flex flex-col flex-grow">
      <Tabs
        value={tabValue}
        className="flex flex-col justify-start h-full w-full"
        onValueChange={handleTabChange}
      >
        <div className="flex w-full justify-center items-center fixed bottom-1 z-50 lg:relative lg:pt-5">
          <TabsList className="w-80 shadow-xl rounded-xl justify-around bg-accent h-10">
            <TabsTrigger
              className="w-full rounded-lg text-accent-foreground h-full"
              value={RoutePaths.LEARNING_PATH}
            >
              Trilha
            </TabsTrigger>
            <TabsTrigger
              className="w-full rounded-lg text-accent-foreground h-full"
              value={RoutePaths.EXPLORE}
            >
              Explorar
            </TabsTrigger>
            <TabsTrigger
              className="w-full rounded-lg text-accent-foreground h-full"
              value={RoutePaths.MEMORY_CARDS}
            >
              Revisão
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="lg:px-10">
          <TabsContent value={RoutePaths.LEARNING_PATH}>
            <LearningPathPage />
          </TabsContent>
          <TabsContent value={RoutePaths.EXPLORE}>
            <VideosHome />
          </TabsContent>
          <TabsContent value={RoutePaths.MEMORY_CARDS}>
            <WordReviewCard />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
