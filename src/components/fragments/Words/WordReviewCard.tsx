import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { getUserLearningWords } from "~/utils/user-learning-words";

import { WordCard } from "~/components/fragments/Words/WordCard";
import { Button } from "~/components/ui/button";
import { LoaderSpinner } from "~/components/ui/loader";

import { MemoryCard } from "../MemoryCard/MemoryCard";

type UserLearningWord = Awaited<
  ReturnType<typeof getUserLearningWords>
>[number];

export const WordReviewCard = () => {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userLearningWords, setUserLearningWords] = useState<
    UserLearningWord[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const result = await getUserLearningWords();
        setUserLearningWords(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  console.log("userLearningWords", userLearningWords);
  if (!userLearningWords || userLearningWords?.length == 0) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        Vazio
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
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
            <Button onClick={() => navigate({ to: "/discovery/words" })}>
              Estudar novas palavras
            </Button>
          </div>
        </WordCard>
      )}
    </>
  );
};
