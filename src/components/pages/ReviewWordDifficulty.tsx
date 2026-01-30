import React, { useEffect } from "react";

import { Meteor } from "meteor/meteor";

import { UserLearningWord } from "/imports/api/user-learning/words/collections";

import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export const ReviewWordDifficulty = ({
  learningWord,
  className,
  setCompleted,
}: {
  learningWord: UserLearningWord;
  className?: string;
  setCompleted?: () => void;
}) => {
  const handleDifficulty = (learningWordId?: string, difficulty?: string) => {
    if (!learningWordId || !difficulty) return;
    Meteor.call(
      "user-learning.words.updateDifficulty",
      { learningWordId, difficulty },
      (error: Error) => {
        if (error) {
          toast("Error", {
            description: error.message,
            duration: 4000,
          });
          return;
        }

        toast("Success", {
          description: "Difficulty updated",
          duration: 2000,
        });

        if (setCompleted) {
          setCompleted();
        }
      },
    );
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      if (["1", "2", "4", "5"].includes(key)) {
        event.preventDefault();
        handleDifficulty(learningWord._id, key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [learningWord?._id]);

  return (
    <div className={cn("flex gap-x-2", className)}>
      <Button onClick={() => handleDifficulty(learningWord._id, "1")}>
        Easy
      </Button>
      <Button onClick={() => handleDifficulty(learningWord._id, "2")}>
        Ok
      </Button>
      <Button onClick={() => handleDifficulty(learningWord._id, "4")}>
        Hard
      </Button>
      <Button onClick={() => handleDifficulty(learningWord._id, "5")}>
        I don't know
      </Button>
    </div>
  );
};
