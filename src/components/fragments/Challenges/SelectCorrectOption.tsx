import * as React from "react";
import { useEffect, useState } from "react";

import { Meteor } from "meteor/meteor";

import { Caption } from "/imports/api/captions/collections";
import { Dictionary } from "/imports/api/words/collections";

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

export const SelectCorrectOption = ({
  dictionaryWord,
  setCompleted,
}: {
  dictionaryWord: Dictionary;
  setCompleted: () => void;
}) => {
  const [allOptions, setAllOptions] = useState<
    Array<Dictionary & { isCorrect: boolean }>
  >([]);
  const correctOption = { ...dictionaryWord, isCorrect: true };

  const [examplesText, setExamplesText] = useState<Caption[]>();
  useEffect(() => {
    Meteor.call(
      "words.random",
      { notIn: [dictionaryWord._id] },
      (err: Error, res: Dictionary[]) => {
        if (err) {
          console.error(err);
          return;
        }

        const incorrectOptions = res.map((word) => ({
          ...word,
          isCorrect: false,
        }));

        setAllOptions([correctOption, ...incorrectOptions]);
      },
    );

    Meteor.call(
      "words.findInText",
      dictionaryWord?.en?.text,
      (err: Error, res: Caption[]) => {
        if (err) {
          console.error(err);
          return;
        }

        const uniqueExamples = new Set();
        const filteredExamples = res.filter((value) => {
          if (!uniqueExamples.has(value.text)) {
            uniqueExamples.add(value.text);
            return true;
          }
          return false;
        });
        setExamplesText(filteredExamples.slice(0, 3));
      },
    );
  }, [dictionaryWord]);

  const selectCorrect = () => {
    toast("Correct!");

    // Set to review in 180 days
    Meteor.call(
      "user-learning.words.add",
      {
        wordId: dictionaryWord._id,
        nextReviewAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
      (err: Error) => {
        if (err) {
          console.error(err);
        }

        setCompleted();
      },
    );
  };

  const selectIncorrect = () => {
    toast("Incorrect!");

    // Set to review now
    Meteor.call(
      "user-learning.words.add",
      {
        wordId: dictionaryWord._id,
        nextReviewAt: new Date(),
      },
      (err: Error) => {
        if (err) {
          console.error(err);
        }

        setCompleted();
      },
    );
  };
  return (
    <Card className="overflow-hidden w-full lg:w-[600px]">
      <CardHeader>
        <CardTitle>{dictionaryWord?.en?.text}</CardTitle>
        <CardDescription>
          {examplesText?.map((caption) => (
            <span
              className="flex flex-wrap gap-x-1 justify-start"
              key={caption._id}
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
                        className={
                          word === dictionaryWord?.en?.text ? "font-bold" : ""
                        }
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
          .map((option) => (
            <Button
              className="flex-grow"
              key={option._id}
              onClick={option.isCorrect ? selectCorrect : selectIncorrect}
            >
              {option.pt?.text}
            </Button>
          ))}
      </CardFooter>
    </Card>
  );
};
