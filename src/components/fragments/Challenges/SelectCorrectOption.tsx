import * as React from "react";
import { useEffect, useState } from "react";

import { WordDialogExplanation } from "~/components/fragments/Words/WordDialogExplanation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { toast } from "sonner";
import { getRandomWord, findTextWithWord } from "~/utils/words";
import { createUserLearningWord } from "~/utils/user-learning-words";

type Word = Awaited<ReturnType<typeof getRandomWord>>[number];
type Caption = Awaited<ReturnType<typeof findTextWithWord>>[number];

export const SelectCorrectOption = ({
  dictionaryWord,
  setCompleted,
}: {
  dictionaryWord: Word;
  setCompleted: () => void;
}) => {
  const [allOptions, setAllOptions] = useState<
    Array<Word & { isCorrect: boolean }>
  >([]);
  const correctOption = { ...dictionaryWord, isCorrect: true };

  const [examplesText, setExamplesText] = useState<Caption[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const randomWords = await getRandomWord({
          data: { notIn: [dictionaryWord.id], limit: 4 },
        });
        const incorrectOptions = randomWords.map((word) => ({
          ...word,
          isCorrect: false,
        }));
        setAllOptions([correctOption, ...incorrectOptions]);
      } catch (err) {
        console.error(err);
      }

      const enText = (dictionaryWord?.en as { text?: string })?.text;
      if (enText) {
        try {
          const captions = await findTextWithWord({ data: enText });
          const uniqueExamples = new Set<string>();
          const filteredExamples = captions.filter((value) => {
            if (!uniqueExamples.has(value.text)) {
              uniqueExamples.add(value.text);
              return true;
            }
            return false;
          });
          setExamplesText(filteredExamples.slice(0, 3));
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [dictionaryWord]);

  const selectCorrect = async () => {
    toast("Correct!");

    try {
      // Set to review in 180 days
      await createUserLearningWord({
        data: {
          wordId: dictionaryWord.id,
          nextReviewAt: new Date(
            Date.now() + 180 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      });
    } catch (err) {
      console.error(err);
    }

    setCompleted();
  };

  const selectIncorrect = async () => {
    toast("Incorrect!");

    try {
      // Set to review now
      await createUserLearningWord({
        data: {
          wordId: dictionaryWord.id,
          nextReviewAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error(err);
    }

    setCompleted();
  };

  const enContent = dictionaryWord?.en as { text?: string } | undefined;

  return (
    <Card className="overflow-hidden w-full lg:w-[600px]">
      <CardHeader>
        <CardTitle>{enContent?.text}</CardTitle>
        <CardDescription>
          {examplesText?.map((caption) => (
            <span
              className="flex flex-wrap gap-x-1 justify-start"
              key={caption.id}
            >
              {caption.text
                .toLocaleLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "")
                .trim()
                .split(/[ \n]/)
                .map(
                  (word, idx) =>
                    word && (
                      <WordDialogExplanation
                        key={idx}
                        word={word}
                        className={word === enContent?.text ? "font-bold" : ""}
                      />
                    ),
                )}
            </span>
          ))}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap justify-center gap-2">
        {allOptions
          .sort(() => Math.random() - 0.5)
          .map((option) => {
            const ptContent = option.pt as { text?: string } | undefined;
            return (
              <Button
                className="grow"
                key={option.id}
                onClick={option.isCorrect ? selectCorrect : selectIncorrect}
              >
                {ptContent?.text}
              </Button>
            );
          })}
      </CardFooter>
    </Card>
  );
};
