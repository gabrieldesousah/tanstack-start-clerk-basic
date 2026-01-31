import { useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { getWordById } from "~/utils/words";

import { WordDialogExplanation } from "../WordDialogExplanation";

type Word = Awaited<ReturnType<typeof getWordById>>;

type DifficultyRate = {
  rate: string;
  reviewedAt: string;
};

type UserLearningWord = {
  id: string;
  wordId: string;
  userId: string;
  difficultyRate: DifficultyRate[] | null;
  nextReviewAt: Date;
  createdAt: Date;
};

const WordCell = ({ wordId }: { wordId: string }) => {
  const [word, setWord] = useState<Word>();

  useEffect(() => {
    getWordById({ data: wordId }).then(setWord).catch(console.error);
  }, [wordId]);

  const enContent = word?.en as { text?: string } | undefined;

  return (
    <div className="text-left font-medium">
      {enContent?.text && <WordDialogExplanation word={enContent.text} />}
    </div>
  );
};

const TranslationCell = ({ wordId }: { wordId: string }) => {
  const [word, setWord] = useState<Word>();

  useEffect(() => {
    getWordById({ data: wordId }).then(setWord).catch(console.error);
  }, [wordId]);

  const ptContent = word?.pt as { text?: string } | undefined;

  return <div className="text-left font-medium">{ptContent?.text}</div>;
};

export const columns: ColumnDef<UserLearningWord>[] = [
  {
    accessorKey: "word",
    header: () => "Word",
    cell: ({ row }) => <WordCell wordId={row.original.wordId} />,
  },
  {
    accessorKey: "translation",
    header: () => "Translation",
    cell: ({ row }) => <TranslationCell wordId={row.original.wordId} />,
  },
  {
    accessorKey: "reviews",
    header: "Reviews",
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">
          <ul>
            {row.original.difficultyRate?.map((difficultyRate, index) => (
              <li key={index}>
                <span>
                  {new Date(difficultyRate.reviewedAt).toDateString()}:{" "}
                </span>
                <span>{difficultyRate.rate}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">
          {new Date(row.original.createdAt).toDateString()}
        </div>
      );
    },
  },
];
