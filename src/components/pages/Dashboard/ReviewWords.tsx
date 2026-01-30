import React from "react";

import { useFind, useSubscribe } from "meteor/react-meteor-data";

import { UserLearningWordsCollection } from "/imports/api/user-learning/words/collections";

import { columns } from "~/components/Words/LearningWordsTable/Columns";
import { DataTable } from "~/components/Words/LearningWordsTable/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LoaderSpinner } from "~/components/ui/loader";

export const ReviewWords = () => {
  const isLoading = useSubscribe("user-learning.words.with-dictionary");

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
  console.log("userLearningWords", userLearningWords, isLoading());
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Words</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading() ? (
          <div className="flex justify-center items-center h-full w-full">
            <LoaderSpinner />
          </div>
        ) : userLearningWords.length === 0 ? (
          <>No words to review</>
        ) : (
          <>
            <h2 className="text-2xl font-bold my-5">Your dictionary</h2>
            <DataTable data={userLearningWords} columns={columns} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
