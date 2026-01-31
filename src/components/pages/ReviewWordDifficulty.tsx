import { useEffect } from "react";

import { toast } from "sonner";

import { updateDifficulty } from "~/utils/user-learning-words";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

type UserLearningWord = {
  id: string;
  wordId: string;
  userId: string;
  difficultyRate: Array<{ rate: string; reviewedAt: string }> | null;
  nextReviewAt: Date;
  createdAt: Date;
};

export const ReviewWordDifficulty = ({
  learningWord,
  className,
  setCompleted,
}: {
  learningWord: UserLearningWord;
  className?: string;
  setCompleted?: () => void;
}) => {
  const handleDifficulty = async (
    learningWordId?: string,
    difficulty?: string,
  ) => {
    if (!learningWordId || !difficulty) return;

    try {
      await updateDifficulty({
        data: { learningWordId, difficulty },
      });

      toast("Success", {
        description: "Difficulty updated",
        duration: 2000,
      });

      if (setCompleted) {
        setCompleted();
      }
    } catch (error) {
      toast("Error", {
        description: error instanceof Error ? error.message : "Unknown error",
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      if (["1", "2", "4", "5"].includes(key)) {
        event.preventDefault();
        handleDifficulty(learningWord.id, key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [learningWord?.id]);

  return (
    <div className={cn("flex gap-x-2", className)}>
      <Button onClick={() => handleDifficulty(learningWord.id, "1")}>
        Easy
      </Button>
      <Button onClick={() => handleDifficulty(learningWord.id, "2")}>Ok</Button>
      <Button onClick={() => handleDifficulty(learningWord.id, "4")}>
        Hard
      </Button>
      <Button onClick={() => handleDifficulty(learningWord.id, "5")}>
        I don't know
      </Button>
    </div>
  );
};
