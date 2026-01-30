import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFind, useSubscribe } from "meteor/react-meteor-data";

import { UserLearningWordsCollection } from "/imports/api/user-learning/words/collections";

import { RoutePaths } from "/imports/ui/routes/RoutePaths";

import { WordCard } from "~/components/fragments/Words/WordCard";
import { Button } from "~/components/ui/button";
import { LoaderSpinner } from "~/components/ui/loader";

import { MemoryCard } from "../MemoryCard/MemoryCard";

export const WordReviewCard = () => {
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  const isLoading = useSubscribe("user-learning.words");
  const userLearningWords = useFind(() =>
    UserLearningWordsCollection.find(
      {},
      {
        sort: {
          nextReviewAt: 1 as const,
        },
      },
    ),
  );

  return (
    <>
      {isLoading() ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoaderSpinner />
        </div>
      ) : userLearningWords[index] ? (
        <MemoryCard
          learningWord={userLearningWords[index]}
          setCompleted={() => setIndex(index + 1)}
        />
      ) : (
        <WordCard>
          <div className="p-6">
            <div className="mb-2 text-2xl font-semibold gap-2">
              <span>No more words to review 🎉</span>
              <span>Return soon to review more words!</span>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <Button onClick={() => navigate(RoutePaths.DISCOVERY_WORDS)}>
              Estudar novas palavras
            </Button>
          </div>
        </WordCard>
      )}
    </>
  );
};
