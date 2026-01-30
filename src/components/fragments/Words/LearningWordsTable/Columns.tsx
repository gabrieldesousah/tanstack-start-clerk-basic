import * as React from "react";

import { useFind } from "meteor/react-meteor-data";

import { ColumnDef } from "@tanstack/react-table";

import { UserLearningWord } from "/imports/api/user-learning/words/collections";
import { DictionaryCollection } from "/imports/api/words/collections";

import { WordDialogExplanation } from "../WordDialogExplanation";

export const columns: ColumnDef<UserLearningWord>[] = [
  {
    accessorKey: "word",
    header: () => "Word",
    cell: ({ row }) => {
      const [word] = useFind(() =>
        DictionaryCollection.find(row.original.wordId),
      );
      return (
        <div className="text-left font-medium">
          {word?.en?.text && <WordDialogExplanation word={word?.en?.text} />}
        </div>
      );
    },
  },
  {
    accessorKey: "translation",
    header: () => "Translation",
    cell: ({ row }) => {
      const [word] = useFind(() =>
        DictionaryCollection.find(row.original.wordId),
      );
      return <div className="text-left font-medium">{word?.pt?.text}</div>;
    },
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
                <span>{difficultyRate.reviewedAt.toDateString()}: </span>
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
          {row.original.createdAt.toDateString()}
        </div>
      );
    },
  },
];
