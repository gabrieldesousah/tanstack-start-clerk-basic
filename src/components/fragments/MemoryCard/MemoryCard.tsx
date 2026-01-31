import { useEffect, useState } from "react";

import { ReviewWordDifficulty } from "~/components/pages/ReviewWordDifficulty";
import { getWordById } from "~/utils/words";

import { FlipCardComponent } from "./FlipCardComponent";

type Word = Awaited<ReturnType<typeof getWordById>>;

type UserLearningWord = {
  id: string;
  wordId: string;
  userId: string;
  difficultyRate: unknown;
  nextReviewAt: Date;
  createdAt: Date;
};

export const MemoryCard = ({
  learningWord,
  setCompleted,
}: {
  learningWord: UserLearningWord;
  setCompleted?: () => void;
}) => {
  const [dictionaryWord, setDictionaryWord] = useState<Word>();

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const result = await getWordById({ data: learningWord.wordId });
        setDictionaryWord(result);
      } catch (error) {
        console.error(error);
      }
    };

    if (learningWord?.wordId) {
      fetchWord();
    }
  }, [learningWord?.wordId]);

  return (
    <div className="mx-auto flex flex-col p-5 gap-4 justify-center items-center">
      <FlipCardComponent dictionaryWord={dictionaryWord} />
      <ReviewWordDifficulty
        className="z-50"
        learningWord={learningWord}
        setCompleted={setCompleted}
      />
    </div>
  );
};
